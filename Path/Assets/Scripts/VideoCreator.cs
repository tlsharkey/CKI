using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Video;
using Vuforia;

public class VideoCreator : MonoBehaviour
{
    public static VideoCreator Instance;
    public List<VideoPlayer> Players = new List<VideoPlayer>();

    [SerializeField]
    private GameObject VideoPrefab;

    private void Awake()
    {
        Instance = this;
    }

    public GameObject CreateVideo(Experience experience)
    {
        // Instantiate and set values of VideoPlayer
        GameObject video = Instantiate(VideoPrefab, experience.Marker.transform);
        video.tag = "experience";
        VideoPlayer player = video.GetComponent<VideoPlayer>();
        player.url = experience.videoExperience;
        player.Pause();

        // Keep track of player
        //this.Players.Add(player);

        return video;
    }
}
