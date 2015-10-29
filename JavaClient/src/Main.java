import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

/**
 * Created by Alex on 10/29/2015.
 */
public class Main
{
    public static void main(String[] args)
    {
        try
        {
            InetAddress localhost = InetAddress.getLocalHost();
            Socket serverConnection = new Socket(localhost,8080);
            System.out.println("Connected: " + serverConnection.isConnected());
            PrintWriter write = new PrintWriter(serverConnection.getOutputStream());
            
        }
        catch(UnknownHostException e)
        {
            e.printStackTrace();
            System.exit(-1);
        }catch(IOException e)
        {
            e.printStackTrace();
        }

    }
}
