import axios from "axios";
import { toast } from "react-toastify";

export const getMeetings = async (page) => {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER}/meetings`,
      params: {
        page
      }
    });
    return data;
  } catch (err) {
    if (err?.message) {
      toast.error(err?.message);
    }
  }
};

export const getMeetingById = async (id) => {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER}/meetings/${id}`,
    });
    return data;
  } catch (err) {
    if (err?.message) {
      toast.error(err?.message);
    }
  }
};

export const createMeeting = async (form) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER}/meetings`,
      data: form
    });
    return data;
  } catch (err) {
    if (err?.message) {
      toast.error(err?.message);
    }
  }
};

export const updateMeeting = async (id, form) => {
  try {
    const { data } = await axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_SERVER}/meetings/${id}`,
      data: form
    });
    return data;
  } catch (err) {
    if (err?.message) {
      toast.error(err?.message);
    }
  }
};

export const deleteMeeting = async (ids) => {
  try {
    const { data } = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_SERVER}/meetings`,
      data: ids
    });
    return data;
  } catch (err) {
    if (err?.message) {
      toast.error(err?.message);
    }
  }
};