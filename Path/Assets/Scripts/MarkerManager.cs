using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MarkerManager : MonoBehaviour
{
    public List<Experience> Experiences = new List<Experience>();

    public static MarkerManager Instance;

    private void Awake()
    {
        Instance = this;
    }
}
