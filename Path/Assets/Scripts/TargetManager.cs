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
    public string Target
    {
        get
        {
            return GetComponent<ImageTargetBehaviour>().ImageTarget.Name;
        }
    }


}
