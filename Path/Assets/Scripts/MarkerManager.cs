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


}
