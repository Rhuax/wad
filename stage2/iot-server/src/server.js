const express = require('express');
const lcd = require('jsupm_i2clcd');
const buzzer = require('jsupm_buzzer');
const grove = require('jsupm_grove');
const fs = require('fs');
const path = require('path');

module.exports = class Server
{
    constructor(code)
    {
        if(!code)
            code = '0000-000000-00000000';

        this._jingle_index = 0;
        this._jingle_notes = undefined;
        this._jingle = undefined;
        this._button_poll = undefined;

        this._code = code;
        this._server = express();
        this._lcd = new lcd.Jhd1313m1(0, 0x3E, 0x62);
        this._buzzer = new buzzer.Buzzer(6);
        this._button = new grove.GroveButton(3);
        this._led = new grove.GroveLed(4);
        this._setup();
    }

    _setup()
    {
        console.log(this._buzzer.name(), 'connected');
        console.log(this._lcd.name(), 'connected');
        fs.readFile(path.resolve(__dirname, '..', 'jingle.json'), (error, data) =>
        {
            if(error)
                return console.error(error);

            this._jingle_notes = JSON.parse(data).notes;
            console.log('Winner jingle loaded');

            this._reset();
            this._button_poll = setInterval(() =>
            {
                if(this._button.value())
                    this._reset();
            }, 100);

            return this._setup_routes();
        });
    }

    _reset()
    {
        this._lcd.clear();
        this._led.off();
        this._buzzer.stopSound();
        this._buzzer.setVolume(1);
        this._lcd.setCursor(0, 0);
        this._lcd.setColor(255, 0, 0);
        this._lcd.write('Waiting for');
        this._lcd.setCursor(1, 2);
        this._lcd.write('winner...');
    }

    _setup_routes()
    {
        this._server.post('/reset', (request, response) =>
        {
            console.info('New reset request received');
            this._reset();
            response.sendStatus(200);
        });

        this._server.get('/winner', (request, response) =>
        {
            console.info('New get winner request received', request.params);

            return response.status(200).send('Try to POST me instead (not on facebook :P)! need a hint? Try visiting https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol').end();
        });

        this._server.post('/winner', (request, response) =>
        {
            console.info('New winner request received', request.params);
            if(request.body && request.body.name && request.body.code && request.body.code === this._code)
            {
                this._lcd.clear();
                this._led.on();
                this._jingle_index = 0;
                this._lcd.setCursor(0, 0);
                this._lcd.setColor(0, 0, 255);
                this._lcd.write('The winner is');
                this._lcd.setCursor(1, 2);
                this._lcd.write(request.body.name);
                this._play_jingle();
                response.sendStatus(200);
            }
            else
                response.sendStatus(403);
        });
    }

    _play_jingle()
    {
        this._jingle = setInterval(this._play_note.bind(this), 150);
    }

    _play_note()
    {
        if(this._jingle_index < this._jingle_notes.length)
        {
            this._buzzer.playSound(this._jingle_notes[this._jingle_index].note, this._jingle_notes[this._jingle_index].duration);
            this._jingle_index++;
        }
        else
        {
            clearInterval(this._jingle);
            this._buzzer.stopSound();
        }
    }

    listen(port)
    {
        if(!port)
            port = 3000;

        this._server.listen(port, () =>
        {
            console.log('Listening on port', port);
        });
    }
};
