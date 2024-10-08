import { Dispatch } from "redux";
import {
  start,
  end,
  error,
  getStreakReducer,
  getStreaksReducer,
  getUserStreaksReducer,
  createStreakReducer,
  shareStreakInGroupsReducer,
  shareStreakReducer,
  updateStreakReducer,
  likeStreakReducer,
  commentStreakReducer,
  deleteStreakReducer,
} from "../reducers/streak";
import { createGroupStreakReducer } from "../reducers/group";
import {
  saveStreakReducer,
  saveStreakInCollectionsReducer,
  unsaveStreakReducer,
} from "../reducers/collection";
import * as api from "../api";
import { Streak, User } from "../../interfaces";

export const getStreak = (streakId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(start());
    const { data } = await api.getStreak(streakId);
    dispatch(getStreakReducer(data));
    dispatch(end());
  } catch (err: any) {
    err.response?.data?.message
      ? dispatch(error(err.response.data.message))
      : dispatch(error(err.message));
  }
};

export const getStreaks =
  (loading: boolean = false) =>
  async (dispatch: Dispatch) => {
    try {
      loading && dispatch(start());
      const { data } = await api.getStreaks();
      dispatch(getStreaksReducer(data));
      dispatch(end());
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };
export const getSavedStreaks = () => async (dispatch: Dispatch) => {
  try {
    dispatch(start());
    const { data } = await api.getSavedStreaks();
    dispatch(getStreaksReducer(data));
    dispatch(end());
  } catch (err: any) {
    err.response?.data?.message
      ? dispatch(error(err.response.data.message))
      : dispatch(error(err.message));
  }
};

export const getUserStreaks =
  (userId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(start());
      const { data } = await api.getUserStreaks(userId);
      dispatch(getUserStreaksReducer(data));
      dispatch(end());
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };

export const createStreak =
  (streakData: any, onClose: () => void) => async (dispatch: Dispatch) => {
    try {
      dispatch(start());
      const { data } = await api.createStreak(streakData);
      if (streakData.groupId) {
        dispatch(
          createGroupStreakReducer({
            groupId: streakData.groupId as string,
            streak: data,
          })
        );
      } else {
        dispatch(createStreakReducer(data));
      }
      onClose();
      dispatch(end());
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };

export const updateStreak =
  (
    streakId: string,
    streakData: any,
    onClose: ()=> void
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(start());
      const { data } = await api.updateStreak(streakId, streakData);
      dispatch(updateStreakReducer(data));
      onClose();
      dispatch(end());
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };
export const shareStreak =
  (streak: Streak, friendIds: string[], loggedUserId: string, setOpen: any) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(shareStreakReducer({ streak, friendIds }));
      await api.shareStreak(streak._id as string, friendIds);
      setOpen(false);
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };
export const shareStreakInGroups =
  (streak: Streak, groupIds: string[], loggedUserId: string, setOpen: any) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(shareStreakInGroupsReducer({ streak, groupIds }));
      await api.shareStreakInGroups(streak._id as string, groupIds);
      setOpen(false);
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };
export const saveStreak =
  (streak: Streak, type: "save" | "unsave") => async (dispatch: Dispatch) => {
    try {
      type == "save"
        ? dispatch(saveStreakReducer({ streak }))
        : dispatch(unsaveStreakReducer({ streak }));
      await api.saveStreak(streak._id as string);
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };
export const saveStreakInCollections =
  (streak: Streak, collections: string[], setOpen: any) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(
        saveStreakInCollectionsReducer({ streak, collectionIds: collections })
      );
      await api.saveStreakInCollections(streak._id as string, collections);
      setOpen(false);
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };
export const likeStreak =
  (streakId: string, loggedUserId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(likeStreakReducer({ streakId, loggedUserId }));
      await api.likeStreak(streakId);
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };

export const commentStreak =
  (codeId: string, content: string, loggedUser: User) =>
  async (dispatch: Dispatch) => {
    try {
      await api.commentStreak(codeId, content);
      dispatch(
        commentStreakReducer({ postId: codeId, content, user: loggedUser! })
      );
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };

export const deleteStreak =
  (streakId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(start());
      const { data } = await api.deleteStreak(streakId);
      dispatch(deleteStreakReducer(data));
      dispatch(end());
    } catch (err: any) {
      err.response?.data?.message
        ? dispatch(error(err.response.data.message))
        : dispatch(error(err.message));
    }
  };
