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
        Debug.Log("------ SETTING EXPERIENCE TO MARKER -------");
        foreach (Experience experience in Experiences)
        {
            Debug.Log(string.Format("=== Handling Experience tied to sticker {0}", experience.id));

            /// Create Marker ///
            // Instantiate
            GameObject imageTargetObject = Instantiate(ImageTargetPrefab);
            Markers.Add(imageTargetObject);
            ImageTargetBehaviour imageTargetBehaviour = imageTargetObject.GetComponent<ImageTargetBehaviour>();
            ImageTarget imageTarget = imageTargetBehaviour.ImageTarget;
            //Debug.Log("Instantiated and got data from instance.");


            // Get ObjectTracker
            ObjectTracker tracker = TrackerManager.Instance.GetTracker<ObjectTracker>();

            // Get DataSet being used
            IEnumerable<DataSet> dataSets = tracker.GetActiveDataSets();
            DataSet dataSet = null;
            foreach(DataSet set in dataSets)
            {
                dataSet = set;
                Debug.Log(string.Format("DataSet: {0}", set.ToString()));
            }

            // Get TargetFinder
            foreach( TargetFinder finder in tracker.GetTargetFinders())
            {
                string printData = "Looking through finder...\n";

                // Get (active?) ObjectTargets for the finder
                foreach(ObjectTarget objectTarget in finder.GetObjectTargets())
                {
                    printData += string.Format("\tObjectTarget {0}\n", objectTarget.Name);
                }
                printData += "-----------\n";

                // Get ImageTargetBehaviors corresponding to the finder
                IEnumerable<TargetFinder.TargetSearchResult> results = finder.GetResults();
                if (results != null)
                {
                    foreach (TargetFinder.TargetSearchResult result in results)
                    {
                        //ImageTargetBehaviour behavior = (ImageTargetBehaviour) finder.EnableTracking(result, imageTargetObject);
                        printData += string.Format("\tResult Target Name: {0}\n", result.TargetName);
                    }

                    printData += "-----------\n";
                }
                else
                {
                    printData += "-- no results --\n";
                }


                Debug.Log(printData);
            }

            // Potential Calls
            //dataSet.CreateTrackable(TrackableSource, imageTargetObject);
            //tracker.ImageTargetBuilder.Build("fab-fox", 0.2f);


            //if (experience.id.Equals(marker.name))
            //{
            //    Debug.Log(string.Format("Moving Experience {0} to Marker {1}", experience.id, marker.name));
            //    experience.Player.transform.parent = marker.transform;
            //    return;
            //}
        }
        Debug.Log(string.Format("Didn't find matching experience for marker"));
    }


}
