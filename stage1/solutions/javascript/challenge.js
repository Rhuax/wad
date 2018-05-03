let alphabet = '';

for(let i = 33; i < 126; i++)
    alphabet += String.fromCharCode(i);

console.log('Alphabet is', alphabet, 'length:', alphabet.length);

function encrypt(key, message)
{
    const key_size = key.length;
    const chunk_regex = `.{1,${key_size}}`
    const chunks = message.match(new RegExp(chunk_regex, 'g')); // Split message in chunks of length key.size
    let row_counter = 0;
    let output = '';
    let shift = 0;

    for(let i = 0; i < key_size; i++) // Shift each character of the sum of the ASCCI values of the key's characters
        shift += key.charCodeAt(i); 
    
    for(let chunk of chunks)
    {
        row_counter++;
        let output_chunk = '';
        chunk = chunk.split('').reverse().join(''); // Reverse each chunk
        
        for(let i = 0; i < chunk.length; i++)
        {
            const char_code = alphabet.indexOf(chunk.charAt(i));
            const alphabet_index = (char_code + shift) % alphabet.length;
            output_chunk += alphabet[alphabet_index];
        }

        output += output_chunk.split('').reverse().join('') + ' '; // Reverse the chunk back
        if(row_counter % key_size === 0) // Add a new line each key.size chunks
            output += '\n';
    }
    
    return output.trim();
}

function decrypt(key, message)
{
    const key_size = key.length;
    const chunks = message.split(/\s+/g); // Split for whitespaces and new lines
    let output = '';
    let shift = 0;

    for(let i = 0; i < key_size; i++)
        shift += key.charCodeAt(i);

    for(let chunk of chunks)
    {
        output_chunk = '';
        chunk = chunk.split('').reverse().join('');
        for(let i = 0; i < chunk.length; i++)
        {
            const char = chunk.charAt(i);
            const char_index = alphabet.indexOf(char);
            let output_char = (char_index - shift) % alphabet.length;
            if(output_char < 0)
                output_char = alphabet.length + output_char;
            const decrypted_char = alphabet[output_char];
            output_chunk += decrypted_char;
        }

        output += output_chunk.split('').reverse().join('');
    }

    return output.trim();
}

const message = 'http://<fc:c2:de:34:42:7a>:3030/winner/<code>/<your-name>';
const key = 'wozniak';

console.log('Encrypted secret is');
const encrypted = encrypt(key, message);
console.log(encrypted);
console.log('Decrypted secret is');
console.log(decrypt(key, encrypted));
