import re
def encrypt(key, message):
    alphabet = [chr(i) for i in range(33, 126)]
    
    row_counter = 0
    output = ''
    shift = sum(ord(c) for c in key) # Shift each character of the sum of the ASCCI values of the key's characters
    for chunk in [message[i:i+len(key)] for i in range(0, len(message), len(key))]: # Split message in chunks of length key.size
        row_counter = row_counter + 1
        chunk = chunk[::-1] # Reverse chunk (note this is useless since we operate on chars :P)
        output = output + ''.join(alphabet[(alphabet.index(char) + shift) % len(alphabet)] for char in chunk)[::-1] + ' ' # Reverse chunk back (note this is useless since we operate on chars :P)
        if(row_counter % len(key) == 0): # Add a new line each key.size chunks
            output = output + '\n'

    return output.strip()

def decrypt(key, message):
    alphabet = [chr(i) for i in range(33, 126)]
    shift = sum(ord(c) for c in key)

    output = ''
    for chunk in re.compile(r"\s+").split(message):
        chunk = chunk[::-1] # Reverse chunk (note this is useless since we operate on chars :P)
        output_chunk = ''
        for char in chunk:
            output_char = (alphabet.index(char) - shift) % len(alphabet)
            if output_char < 0:
                output_char = len(alphabet) + output_char
            output_chunk = output_chunk + alphabet[output_char]
        output = output + output_chunk[::-1] # Reverse chunk back (note this is useless since we operate on chars :P)
    return output.strip()

if __name__ == '__main__':
    message = 'http://<fc:c2:de:34:42:7a>:3030/winner'
    key = 'wozniak'

    print('Encrypted secret is')
    encrypted = encrypt(key, message)
    
    print(encrypted);
    print('Decrypted secret is');
    print(decrypt(key, encrypted));
