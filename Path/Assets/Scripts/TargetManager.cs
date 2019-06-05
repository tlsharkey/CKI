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
