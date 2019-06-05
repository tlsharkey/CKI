using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Parser : MonoBehaviour
{

    [SerializeField]
    public string baseUrl = "https://bern.ucsd.edu:8005/";

    public static Parser Instance;

    private void Awake()
    {
        TCPClient.Instance.MessageReceived += Instance_MessageReceived;
        Instance = this;
    }


    void Instance_MessageReceived(string obj)
    {
        JSONObject msg = new JSONObject(obj);
        if (msg.HasField("type"))
        {
            switch(msg["type"].str)
            {
                case "experiences":
                    // Reset list of experiences
                    MarkerManager.Instance.Experiences = new List<Experience>();
                    // Repopulate
                    parseExperiences(msg);
                    break;
                default:
                    Debug.Log(string.Format("Got Unknown ({0}) message type\n{1}", msg["type"].str, msg));
                    break;
            }
        }
        else
        {
            Debug.LogError("Got Message without a type:\n" + obj);
        }
    }

    private void parseExperiences(JSONObject msg)
    {
        List<JSONObject> experiences = msg["experiences"].list;
        Debug.Log(string.Format("Parsing Experiences:\n{0}", msg));

        for (int i=0; i<experiences.Count; i++)
        {
            Experience experience = new Experience(experiences[i]);
        }
    }

}

public struct Experience
{
    public string id;
    public string thumbnail;
    public string videoExperience;
    public UnityEngine.AudioClip audioExperience;
    public Location location;

    public GameObject Player;

    private JSONObject constructor;


    public Experience(JSONObject experience)
    {
        this.constructor = experience;

        this.id = experience["id"].str;
        this.thumbnail = experience["thumbnail"].str;
        this.location = new Location(experience["location"]);

        string expPath = experience["experience"].str;
        string type = expPath.Split('/')[0];
        expPath = expPath.Split('/')[1];

        if (type.Equals("audio"))
        {
            Debug.Log(string.Format("Using Audio {0}", expPath));
            this.audioExperience = Resources.Load<UnityEngine.AudioClip>(expPath);
            this.videoExperience = null;
            this.Player = null;
            this.Player = AudioCreator.Instance.CreateAudio(this);
        } 
        else if (type.Equals("video"))
        {
            Debug.Log(string.Format("Using Video {0}", expPath));
            this.videoExperience = Parser.Instance.baseUrl + experience["experience"].str;
            this.audioExperience = null;
            this.Player = null;
            this.Player = VideoCreator.Instance.CreateVideo(this);
        }
        else
        {
            Debug.LogError("Got Unknown type of file\n" + expPath);
            this.videoExperience = null;
            this.audioExperience = null;
            this.Player = null;
        }

        MarkerManager.Instance.Experiences.Add(this);
    }

    new public string ToString()
    {
        return this.constructor.ToString();
    }
}

public struct Location
{
    public double Longitude;
    public double Latitude;

    public Location(JSONObject location)
    {
        this.Longitude = (double) location["longitude"].f;
        this.Latitude = (double)location["latitude"].f;
    }
}
