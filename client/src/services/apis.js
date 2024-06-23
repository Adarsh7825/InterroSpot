const BASE_URL = "http://localhost:8181/api/v1";

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    FETCH_ROOM_API: BASE_URL + "/rooms/fetch",
    ROOM_UPDATE_API: BASE_URL + "/rooms/update",
    UPLOAD_IMAGE_CANDIDATE_API: BASE_URL + "/captureImage/uploadImage",
    UPLOAD_IMAGE_INTERVIEWER_API: BASE_URL + "/captureImage/uploadImageforInterviewer",
    FETCH_QUESTIONS_API: BASE_URL + "/question/getQuestions",
    FETCH_CANDIDATE_IMAGE_API: BASE_URL + "/captureImage/fetchImage",
    FETCH_INTERVIEWER_IMAGE_API: BASE_URL + "/captureImage/fetchImage",
    FETCH_JOB_POSITION_API: BASE_URL + "/recruiter/getjobposition",
    CREATE_ROOM_API: BASE_URL + "/rooms/create",
}

export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

export const recruiterEndpoints = {
    CREATE_INTERVIEW_API: BASE_URL + "/recruiter/create-interview"
}

export const codeExecutionEndpoints = {
    EXECUTE_CODE_API: BASE_URL + "/code/execute-code"
}

export const createQuestionEndpoints = {
    CREATE_QUESTION_API: BASE_URL + "/question/createQuestion"
}