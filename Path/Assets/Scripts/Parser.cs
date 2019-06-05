using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Parser : MonoBehaviour
{

    [SerializeField]
    public string baseUrl = "https://bern.ucsd.edu:8005/";
    [Tooltip("Automatically determine the base url from the TCP Client")]
    public bool AutoSetUrl = true;

    public static Parser Instance;

    private void Awake()
    {
        TCPClient.Instance.MessageReceived += Instance_MessageReceived;
        Instance = this;
        if (AutoSetUrl)
        {
            baseUrl = "http://" + TCPClient.Instance.HostIp + ":" + (TCPClient.Instance.HostPort - 2) + "/";
        }
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

        MarkerManager.Instance.InstantiateMarkers();
    }

}

public struct Experience
{
    public string id;
    public string thumbnail;
    public string videoExperience;
    public UnityEngine.AudioClip audioExperience;
    public string experience;
    public Location location;

    public GameObject Player;
    public GameObject Marker;

    private JSONObject constructor;
    private string experienceType;


    public Experience(JSONObject experience)
    {
        // Save JSON data
        this.constructor = experience;

        // Copy over basic data
        this.id = experience["id"].str;
        this.thumbnail = experience["thumbnail"].str;
        this.location = new Location(experience["location"]);

        // Get Experience Data
        this.experience = experience["experience"].str;
        this.experienceType = this.experience.Split('/')[0];

        // Set video and audio portions to null for now (CreateExperienceAsset will populate)
        this.audioExperience = null;
        this.videoExperience = null;
        this.Player = null;
        this.Marker = null;

        // Add to manager to keep track of
        MarkerManager.Instance.Experiences.Add(this);
    }

    new public string ToString()
    {
        return this.constructor.ToString();
    }

    public void CreateExperienceAsset()
    {
        string expPath = this.experience.Split('/')[1];

        if (experienceType.Equals("audio"))
        {
            this.audioExperience = Resources.Load<UnityEngine.AudioClip>(expPath);
            this.videoExperience = null;
            this.Player = null;
            this.Player = AudioCreator.Instance.CreateAudio(this);
        }
        else if (experienceType.Equals("video"))
        {
            this.videoExperience = Parser.Instance.baseUrl + this.experience;
            this.audioExperience = null;
            this.Player = null;
            this.Player = VideoCreator.Instance.CreateVideo(this);
        }
        else
        {
            Debug.LogError("Got Unknown type of file\n" + this.experience);
        }
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
