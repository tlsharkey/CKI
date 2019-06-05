using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuforia;

/// <summary>
/// For Dealing with Targets and setting their children
/// When server sends experience data,
/// This class is responsible for checking that data
/// against its ImageTarget to see if/what objects should be made children
/// </summary>
public class TargetManager : MonoBehaviour
{

    public ImageTarget Target
    {
        get
        {
            return GetComponent<ImageTargetBehaviour>().ImageTarget;
        }
    }

    public Experience experience;

    /// <summary>
    /// Register this object with MarkerManager on start
    /// </summary>
    private void Start()
    {
        MarkerManager.Instance.Markers.Add(this);
        //gameObject.name = Target.Name;
    }

    /// <summary>
    /// Check for touch events and play the experience
    /// </summary>
    void Update()
    {
        if ((Input.touchCount == 1) && (Input.GetTouch(0).phase == TouchPhase.Began))
        {
            Debug.Log("CLICK");
            Ray raycast = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
            RaycastHit raycastHit;
            if (Physics.Raycast(raycast, out raycastHit))
            {
                Debug.Log("Something Hit");
                if (raycastHit.collider.CompareTag("experience"))
                {
                    AudioSource audio = raycastHit.collider.gameObject.GetComponent<AudioSource>();
                    UnityEngine.Video.VideoPlayer video = raycastHit.collider.gameObject.GetComponent<UnityEngine.Video.VideoPlayer>();

                    if (audio)
                    {
                        Debug.Log("Clicked Audio Experience");
                        if (audio.isPlaying)
                        {
                            audio.Pause();
                        }
                        else
                        {
                            audio.Play();
                        }
                    }
                    else if (video)
                    {
                        Debug.Log("Clicked Video Experience");
                        if (video.isPlaying)
                        {
                            video.Pause();
                        }
                        else
                        {
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


    public void CheckExperiences()
    {
        foreach (Experience experience in MarkerManager.Instance.Experiences)
        {
            if (experience.id.Equals(Target.Name))
            {
                Debug.Log(string.Format("Found Experience for {0}", Target.Name));
                this.experience = experience;
                // Set Video or Audio
                this.experience.Marker = gameObject;
                this.experience.CreateExperienceAsset();

                return;
            }
        }

        Debug.Log(string.Format("No Experiences set for {0}", Target.Name));
    }
}
