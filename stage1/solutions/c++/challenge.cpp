#include <iostream>
#include <string>
#include <vector>
#include <regex>
#define ALPHABET_LENGTH 93

std :: string encrypt(std :: string key, std :: string message)
{
    char alphabet[ALPHABET_LENGTH];
    for(size_t i = 0; i < ALPHABET_LENGTH; i++)
        alphabet[i] = static_cast <char> (i + 33);
    
    std::vector<std::string> chunks;
    for(size_t i = 0; i < message.length(); i = i + key.length()) // Split message in chunks of length key.size
        chunks.push_back(message.substr(i, key.length()));

    size_t shift = 0;
    for(size_t i = 0; i < key.length(); i++) // Shift each character of the sum of the ASCCI values of the key's characters
        shift += (int)key[i];

    size_t row_counter = 0;
    std :: string output = "";

    for(auto &chunk : chunks)
    {
        row_counter++;
        std :: string output_chunk = "";

        for(size_t i = 0; i < chunk.length(); i++)
        {
            size_t char_code;
            for(size_t j = 0; j < ALPHABET_LENGTH; j++)
            {
                if(alphabet[j] == chunk[i])
                {
                    char_code = j;
                    break;
                }
            }

            size_t alphabet_index = (char_code + shift) % ALPHABET_LENGTH;
            output_chunk += alphabet[alphabet_index];
        }

        output += output_chunk + " ";

        if(row_counter % key.length() == 0) // Add a new line each key.size chunks
            output += '\n';
    } 

    return output;
}

std :: string decrypt(std :: string key, std :: string message)
{
    char alphabet[ALPHABET_LENGTH];
    for(uint16_t i = 0; i < ALPHABET_LENGTH; i++)
        alphabet[i] = static_cast <char> (i + 33);

    int shift = 0;
    for(int i = 0; i < key.length(); i++)
        shift += (int)key[i];

    std :: string output = "";
    std :: regex space_regex("\\s+");
    std::vector<std::string> chunk_iterator 
    {
        std::sregex_token_iterator(message.begin(), message.end(), space_regex, -1), {} // Split for whitespaces and new lines
    };

    for(auto& chunk : chunk_iterator)
    {
        std :: string output_chunk = "";
        for(int i = 0; i < chunk.length(); i++)
        {
            int char_code;
            for(int j = 0; j < ALPHABET_LENGTH; j++)
            {
                if(alphabet[j] == chunk[i])
                {
                    char_code = j;
                    break;
                }
            }

            int output_char = (char_code - shift) % ALPHABET_LENGTH;
            if(output_char < 0)
                output_char = ALPHABET_LENGTH + output_char;
            char decrypted_char = alphabet[output_char];
            output_chunk += decrypted_char;
        }

        output += output_chunk;
    }

    return output;
}

int main()
{
    std :: string message = "http://<fc:c2:de:34:42:7a>:3030/winner";
    std :: string key = "wozniak";

    std :: string encrypted = encrypt(key, message);
    std :: cout  << "Encrypted secret is" << std :: endl << encrypted << std :: endl;
    std :: cout << "Decrypted secret is" << std :: endl << decrypt(key, encrypted) << std :: endl;

    return 0;
}
