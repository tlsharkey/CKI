using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuforia;

public class MarkerManager : MonoBehaviour
{
    public List<Experience> Experiences = new List<Experience>();
    public List<TargetManager> Markers = new List<TargetManager>();
    public static MarkerManager Instance;
    public GameObject ImageTargetPrefab;

    private void Awake()
    {
        Instance = this;
    }

    public void InstantiateMarkers()
    {
        foreach (TargetManager marker in Markers)
        {
            marker.CheckExperiences();
        }
    }



    /// <summary>
    /// Check for touch events and play the experience
    /// </summary>
    void Update()
    {
        if ((Input.touchCount == 1) && (Input.GetTouch(0).phase == TouchPhase.Began))
        {
            Ray raycast = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
            RaycastHit raycastHit;
            if (Physics.Raycast(raycast, out raycastHit))
            {
                if (raycastHit.collider.CompareTag("experience"))
                {
                    AudioSource audio = raycastHit.collider.gameObject.GetComponent<AudioSource>();
                    UnityEngine.Video.VideoPlayer video = raycastHit.collider.gameObject.GetComponent<UnityEngine.Video.VideoPlayer>();

                    if (audio)
                    {
                        if (audio.isPlaying)
                        {
                            Debug.Log("Pausing Audio");
                            audio.Pause();
                        }
                        else
                        {
                            Debug.Log("Playing Audio");
                            audio.Play();
                        }
                    }
                    else if (video)
                    {
                        if (video.isPlaying)
                        {
                            Debug.Log("Pausing Video");
                            video.Pause();
                        }
                        else
                        {
                            Debug.Log("Playing Video");
                            video.Play();
                        }
                    }
                    else
                    {
                        Debug.LogError("Clicked Object tagged as Experience, but didn't have an AudioSource or VideoPlayer.");
                    }
                }
            }
        }
    }


}
