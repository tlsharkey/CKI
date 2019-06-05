using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Vuforia;

public class SimpleCloudHandler : MonoBehaviour, IObjectRecoEventHandler
{
    private ObjectRecoBehaviour mObjectRecoBehavior;
    private bool mIsScanning = false;
    private string mTargetMetadata = "";

    public ImageTargetBehaviour ImageTargetTemplate;

    public void OnInitError(TargetFinder.InitState initError)
    {
        Debug.Log("Object Reco init error " + initError.ToString());
    }

    public void OnInitialized(TargetFinder targetFinder)
    {
        Debug.Log("Object Reco Initialized");
    }

    public void OnNewSearchResult(TargetFinder.TargetSearchResult targetSearchResult)
    {
        TargetFinder.CloudRecoSearchResult cloudRecoSearchResult = (TargetFinder.CloudRecoSearchResult)targetSearchResult;
        // do something with the target metadata
        mTargetMetadata = cloudRecoSearchResult.MetaData;
        // stop the target finder (i.e. stop scanning the cloud)
        mObjectRecoBehavior.RecoEnabled = false;

        // Build augmentation based on target
        if (ImageTargetTemplate)
        {
            ObjectTracker tracker = TrackerManager.Instance.GetTracker<ObjectTracker>();
            IEnumerable<TargetFinder> finders = tracker.GetTargetFinders();
            foreach(TargetFinder finder in finders)
            {
                ImageTargetBehaviour imageTargetBehaviour = (ImageTargetBehaviour)finder.EnableTracking(targetSearchResult, ImageTargetTemplate.gameObject);
            }
        }
    }

    public void OnStateChanged(bool scanning)
    {
        mIsScanning = scanning;
        if (scanning)
        {
            // clear all known trackables
            var tracker = TrackerManager.Instance.GetTracker<ObjectTracker>();
            IEnumerable<TargetFinder> finders = tracker.GetTargetFinders();
            foreach (TargetFinder finder in finders)
            {
                finder.ClearTrackables(false);
            }
        }
    }

    public void OnUpdateError(TargetFinder.UpdateState updateError)
    {
        Debug.Log("Object Reco update error " + updateError.ToString());
    }

    private void OnGUI()
    {
        // Display current 'scanning' status
        GUI.Box(new Rect(100, 100, 200, 50), mIsScanning ? "Scanning" : "Not Scanning");
        // Display metadata of latest detected cloud-target
        GUI.Box(new Rect(100, 200, 200, 50), "Metadata: " + mTargetMetadata);
        // If not scanning, show button
        // so that user can restart cloud scanning
        if (!mIsScanning)
        {
            if (GUI.Button(new Rect(100,300,200,50), "Restart Scanning"))
            {
                // restart TargetFinder
                mObjectRecoBehavior.RecoEnabled = true;
            }
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        mObjectRecoBehavior = GetComponent<ObjectRecoBehaviour>();
        if (mObjectRecoBehavior)
        {
            mObjectRecoBehavior.RegisterEventHandler(this);
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
