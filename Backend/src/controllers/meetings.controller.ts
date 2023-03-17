import { Request, Response, NextFunction } from 'express';
import * as hubspot from '@hubspot/api-client';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config/firebaseConfig';
import { getFirestore, collection, getDocs, addDoc, doc, query, where, updateDoc, deleteDoc } from "@firebase/firestore";
import {seedData} from "../utils/mock";

const properties = [
  "hs_meeting_title",
  "hs_meeting_body",
  "hs_internal_meeting_notes",
  "hs_meeting_external_url",
  "hs_meeting_start_time",
  "hubspot_owner_id"
];

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

export async function list(req: Request, res: Response, next: NextFunction) {
  const page = req.query.page as string | undefined;
  const hubspotClient = new hubspot.Client({ "accessToken": process.env.PrivateAppToken });

  // integrate firebase

  const coll = collection(firestore, 'meetings')
  const response = await getDocs(coll);
  const list = response.docs.map(doc => doc.data());

  const limit = 100;
  const after = page;
  const propertiesWithHistory = undefined;
  const associations = undefined;
  const archived = false;

  try {
    const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived);
    const data = apiResponse?.results.map((res) => {
      return {
        id: res.id,
        internalMeetingNotes: res.properties.hs_internal_meeting_notes,
        lastModifiedDate: res.properties.hs_lastmodifieddate,
        title: res.properties.hs_meeting_title,
        body: res.properties.hs_meeting_body,
        externalUrl: res.properties.hs_meeting_external_url,
        account: res.properties.hubspot_owner_id,
        startTime: res.properties.hs_meeting_start_time,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        archived: res.archived
      }
    })

    res.json({
      data: data,
    });
  } catch (err) {
    next(err);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const hubspotClient = new hubspot.Client({ "accessToken": process.env.PrivateAppToken });

  // integrate firebase
  const leaseQuery = query(collection(firestore, 'meetings'), where('hubId', "==", id))
  const response = await getDocs(leaseQuery);
  const list = response.docs.map(doc => doc.data());


  const meetingId = id;
  const propertiesWithHistory = undefined;
  const associations = undefined;
  const archived = false;
  const idProperty = undefined;

  try {
    const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.getById(meetingId, properties, propertiesWithHistory, associations, archived, idProperty);

    const data = {
      id: apiResponse.id,
      createData: apiResponse.properties.hs_createdate,
      internalMeetingNotes: apiResponse.properties.hs_internal_meeting_notes,
      lastModifiedDate: apiResponse.properties.hs_lastmodifieddate,
      title: apiResponse.properties.hs_meeting_title,
      body: apiResponse.properties.hs_meeting_body,
      externalUrl: apiResponse.properties.hs_meeting_external_url,
      account: apiResponse.properties.hubspot_owner_id,
      startTime: apiResponse.properties.hs_meeting_start_time,
      createdAt: apiResponse.createdAt,
      updatedAt: apiResponse.updatedAt,
      archived: apiResponse.archived
    }

    res.json({
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const info = req.body;
  const hubspotClient = new hubspot.Client({ "accessToken": process.env.PrivateAppToken });

  // integrate firebase
  const leaseQuery = query(collection(firestore, 'meetings'), where('hubId', "==", id));
  const response = await getDocs(leaseQuery);
  const list = response.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data()
    }
  });

  const updateMeeting = doc(firestore, 'meetings', list[0].id)

  const firebaseRes = await updateDoc(updateMeeting, {
    title: info.title,
    description: info.nextSteps,
    time: (+new Date(info.startTime)).toString(),
  });

  const updateBody = {
    "hs_meeting_title": info.title,
    "hs_meeting_body": info.nextSteps,
    "hs_meeting_start_time": (+new Date(info.startTime)).toString(),
  };
  const SimplePublicObjectInput = { properties: updateBody };
  const meetingId = id;
  const idProperty = undefined;

  try {
    const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.update(meetingId, SimplePublicObjectInput, idProperty);
    const data = {
      id: apiResponse.id,
      createData: apiResponse.properties.hs_createdate,
      internalMeetingNotes: apiResponse.properties.hs_internal_meeting_notes,
      lastModifiedDate: apiResponse.properties.hs_lastmodifieddate,
      title: apiResponse.properties.hs_meeting_title,
      body: apiResponse.properties.hs_meeting_body,
      externalUrl: apiResponse.properties.hs_meeting_external_url,
      account: apiResponse.properties.hubspot_owner_id,
      startTime: apiResponse.properties.hs_meeting_start_time,
      createdAt: apiResponse.createdAt,
      updatedAt: apiResponse.updatedAt,
      archived: apiResponse.archived
    }

    res.json({
      data
    });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  const ids = req.body;
  const hubspotClient = new hubspot.Client({ "accessToken": process.env.PrivateAppToken });

  try {
    for(const id of ids) {
      const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.archive(id);
      console.log(JSON.stringify(apiResponse, null, 2));

      const leaseQuery = query(collection(firestore, 'meetings'), where('hubId', "==", id))
      const response = await getDocs(leaseQuery);
      const list = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });

      const deleteMeeting = doc(firestore, 'meetings', list[0].id)

      const firebaseRes = await deleteDoc(deleteMeeting);
    }

    res.json({
      data: true
    });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const hubspotClient = new hubspot.Client({ "accessToken": process.env.PrivateAppToken });

  try {
    for(const data of seedData) {
      const SimplePublicObjectInputForCreate = { properties: data };
      const hubResponse = await hubspotClient.crm.objects.meetings.basicApi.create(SimplePublicObjectInputForCreate);

      const coll = collection(firestore, 'meetings');
      const response = await addDoc(coll, {
        account: hubResponse.properties.hubspot_owner_id,
        time: hubResponse.properties.hs_meeting_start_time,
        title: hubResponse.properties.hs_meeting_title,
        description: hubResponse.properties.hs_meeting_body,
        hubId: hubResponse.id
      });
    }

    res.json({
      data: true
    });
  } catch (err) {
    next(err);
  }
}
