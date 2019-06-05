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
        //Debug.Log("Got URL for creating Audio\n" + experience.audioExperience.name);

        GameObject audio = Instantiate(AudioPrefab, this.transform);
        AudioSource player = audio.GetComponent<AudioSource>();
        player.clip = experience.audioExperience;
        player.Pause();

        this.Players.Add(player);

        return audio;
    }
}
