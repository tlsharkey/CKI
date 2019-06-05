using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Video;

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
        //Debug.Log("Got URL for creating Video\n" + experience.videoExperience.name);

        GameObject video = Instantiate(VideoPrefab, this.transform);
        VideoPlayer player = video.GetComponent<VideoPlayer>();
        player.url = experience.videoExperience;
        player.Pause();

        this.Players.Add(player);

        return video;
    }
}
