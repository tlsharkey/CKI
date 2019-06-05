using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

public class AudioCreator : MonoBehaviour
{
    public static AudioCreator Instance;
    public List<AudioSource> Players = new List<AudioSource>();

    [SerializeField]
    private GameObject AudioPrefab;

    private void Awake()
    {
        Instance = this;
    }

    public GameObject CreateAudio(Experience experience)
    {
        // Instantiate AudioSource and set values
        GameObject audio = Instantiate(AudioPrefab, experience.Marker.transform);
        audio.tag = "experience";
        AudioSource player = audio.GetComponent<AudioSource>();
        player.clip = experience.audioExperience;
        player.Pause();

        // Keep track of AudioSource
        //this.Players.Add(player);

        return audio;
    }
}
