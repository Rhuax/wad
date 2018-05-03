public class Challenge
{
    public static char[] alphabet;
    public static String encrypt(String key, String message)
    {
        String [] chunks = message.split("(?<=\\G.{4})"); // Split message in chunks of length key.size
        
        int row_counter = 0;
        String output = "";
        int shift = 0;
        for(int i = 0; i < key.length(); i++) // Shift each character of the sum of the ASCCI values of the key's characters
            shift += key.charAt(i);

        for(String chunk : chunks)
        {
            chunk = new StringBuffer(chunk).reverse().toString(); // Reverse each chunk. Note that this is useless since we operate on chars
            row_counter++;
            String output_chunk = "";

            for(int i = 0; i < chunk.length(); i++)
            {
                int char_code = 0;
                for(int j = 0; j < 93; j++)
                {
                    if(Challenge.alphabet[j] == chunk.charAt(i))
                    {
                        char_code = j;
                        break;
                    }
                }

                int alphabet_index = (char_code + shift) % 93;
                output_chunk += alphabet[alphabet_index];
            }

            output += new StringBuffer(output_chunk).reverse().toString() + " "; // Reverse the chunk back
            if(row_counter % key.length() == 0) // Add a new line each key.size chunks
                output += '\n';
        }
        return output;
    }

    public static  String decrypt(String key, String message)
    {
        String [] chunks = message.split("\\s+"); // Split for whitespaces and new lines

        String output = "";
        int shift = 0;
        for(int i = 0; i < key.length(); i++) // Shift each character of the sum of the ASCCI values of the key's characters
            shift += key.charAt(i);

        for(String chunk : chunks)
        {
            chunk = new StringBuffer(chunk).reverse().toString();
            String output_chunk = "";
            for(int i = 0; i < chunk.length(); i++)
            {
                int char_code = 0;
                for(int j = 0; j < 93; j++)
                {
                    if(Challenge.alphabet[j] == chunk.charAt(i))
                    {
                        char_code = j;
                        break;
                    }
                }

                int output_char = (char_code - shift) % 93;
                if(output_char < 0)
                    output_char = 93 + output_char;
                char decrypted_char = alphabet[output_char];
                output_chunk += decrypted_char;
            }
            output += chunk = new StringBuffer(output_chunk).reverse().toString();;
        }

        return output;
    }

	public static void main(String [] args)
	{
        Challenge.alphabet = new char[93];
        for(int i = 0; i < 93; i++)
            alphabet[i] = (char) (i + 33);
    
		String message = "http://<fc:c2:de:34:42:7a>:3030/winner";
        String key = "wozniak";

        String encrypted = Challenge.encrypt(key, message);
        System.out.println("Encrypted secret is");
        System.out.println(encrypted);
        System.out.println("Decrypted secret is");
        System.out.println(Challenge.decrypt(key, encrypted));
	}
}
