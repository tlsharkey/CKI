using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using UnityEngine;

public class TCPClient : MonoBehaviour
{
    #region public members
    public string HostIp;
    public int HostPort;
    public event Action<string> MessageReceived;
    [HideInInspector]
    public Queue<String> messageQueue = new Queue<string>();
    public bool SetupSent;
    bool killThreadRequested = false;
    #endregion

    #region private members
    private TcpClient socketConnection;
    private Thread clientReceiveThread;
    #endregion

    public static TCPClient Instance;


    private void Awake()
    {
        Instance = this;
    }
    // Use this for initialization
    void OnEnable()
    {
        killThreadRequested = false;
        ConnectToTcpServer();
        SetupSent = false;

    }

    private void OnDisable()
    {
        CloseConnection();
    }

    // Update is called once per frame
    void Update()
    {
        if (!SetupSent)
        {
            if (socketConnection != null)
            {
                Debug.Log("Sending Setup Message");
                JSONObject msg = new JSONObject();
                msg.AddField("type", "verification");
                msg.AddField("code", "Kitty Kitty");
                Send(msg.ToString());
                SetupSent = true;
            }
        }

#if !NETFX_CORE
        // Lock if *not* on UWP to avoid thread conflicts
        lock (messageQueue)
#endif
        {
            while(messageQueue.Count > 0)
            {
                //process message received
                String message = messageQueue.Dequeue();

                //Trigger callback
                MessageReceived.Invoke(message);
            }
        }
    }
    /// <summary>
    /// Setup socket connection.
    /// </summary>
    private void ConnectToTcpServer()
    {
        try
        {
            clientReceiveThread = new Thread(new ThreadStart(ListenForData));
            clientReceiveThread.IsBackground = true;
            clientReceiveThread.Start();
        }
        catch (Exception e)
        {
            Debug.Log("On client connect exception " + e);
        }
    }
    /// <summary>
    /// Runs in background clientReceiveThread; Listens for incomming data.
    /// </summary>
    private void ListenForData()
    {
        try
        {
            socketConnection = new TcpClient(HostIp, HostPort);
            Byte[] lengthHeader = new byte[4];
            // Get a stream object for reading
            while (!killThreadRequested)
            {
                using (NetworkStream stream = socketConnection.GetStream())
                {
                    int length;
                    while ((length = stream.Read(lengthHeader, 0, lengthHeader.Length)) != 0)
                    {
                        //// Get Message Length from header
                        //length = stream.Read(lengthHeader, 0, lengthHeader.Length); // read 4 bytes from stream
                        UInt32 msgLength = BitConverter.ToUInt32(lengthHeader, 0); // convert to int (UInt32LE)
                        Byte[] bytes = new byte[msgLength]; // create appropriately sized byte array for message


                        //// Get Message
                        stream.Read(bytes, 0, bytes.Length); // read from stream
                        string serverMessage = Encoding.UTF8.GetString(bytes); // convert to string
                        //Debug.Log("server message received as: " + serverMessage);

                        lock (messageQueue)
                        {
                            messageQueue.Enqueue(serverMessage);
                        }
                    }
                }

                Debug.Log("Thread Listen for Data");
            }
        }
        catch (SocketException socketException)
        {
            Debug.LogError("Socket exception: " + socketException);
        }
    }

    //private void ListenForData()
    //{
    //    try
    //    {
    //        socketConnection = new TcpClient(HostIp, HostPort);
    //        Byte[] bytes = new Byte[16384]; // TODO: get message length and set it to this.
    //        while (true)
    //        {
    //            // Get a stream object for reading
    //            using (NetworkStream stream = socketConnection.GetStream())
    //            {
    //                int length;
    //                // Read incomming stream into byte arrary.
    //                while ((length = stream.Read(bytes, 0, bytes.Length)) != 0)
    //                {
    //                    var incommingData = new byte[length];
    //                    Array.Copy(bytes, 0, incommingData, 0, length);
    //                    // Convert byte array to string message.
    //                    string serverMessage = Encoding.ASCII.GetString(incommingData);
    //                    Debug.Log("server message received as: " + serverMessage);

    //                    lock (messageQueue)
    //                    {
    //                        messageQueue.Enqueue(serverMessage);
    //                    }
    //                }
    //            }
    //        }
    //    }
    //    catch (SocketException socketException)
    //    {
    //        Debug.Log("Socket exception: " + socketException);
    //    }
    //}


    /// <summary>
    /// Send message to server using socket connection.
    /// </summary>
    public void Send(string msg)
    {
        if (socketConnection == null)
        {
            Debug.LogError("No socket connection");
            return;
        }
        try
        {
            // Get a stream object for writing.
            NetworkStream stream = socketConnection.GetStream(); // FIXME: creating Error on HoloLens
            if (stream.CanWrite)
            {
                // Send uint32 of message length to server
                UInt32 len = (UInt32) msg.Length;
                String len_str = len.ToString();
                while (len_str.Length < 4)
                {
                    len_str = "0" + len_str;
                }

                // Send message length
                //byte[] lenBytes = Encoding.UTF8.GetBytes(len_str);
                //stream.Write(lenBytes, 0, lenBytes.Length);

                //byte[] message = Encoding.UTF8.GetBytes(msg);
                //byte[] messageLen = BitConverter.GetBytes(len);
                //Debug.Log(string.Format("length: {0} message {1}", BitConverter.ToUInt32(messageLen, 0), Encoding.UTF8.GetString(message)));
                //byte[] messageToSend = new byte[messageLen.Length + message.Length];
                //System.Buffer.BlockCopy(messageLen, 0, messageToSend, 0, messageLen.Length);
                //System.Buffer.BlockCopy(message, 0, messageToSend, 0, message.Length);
                //stream.Write(messageToSend, 0, messageToSend.Length);

                // Send message
                byte[] msgBytes = Encoding.UTF8.GetBytes(len_str+msg);
                stream.Write(msgBytes, 0, msgBytes.Length);
                Debug.Log("Sent TCP Message\n" + msg);
            }
        }
        catch (SocketException socketException)
        {
            Debug.LogError("Socket exception: " + socketException);
        }
    }

    public void CloseConnection()
    {
        if (clientReceiveThread != null && clientReceiveThread.IsAlive)
        {
            // Close Socket
            killThreadRequested = true;
            if (socketConnection != null)
            {
                socketConnection.Close();
            }

            // Stop Thread
            clientReceiveThread.Join();
        }
    }
}
