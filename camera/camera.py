import os
import cv2
import face_recognition
import time
import requests

import numpy as np

# Directory containing known faces
known_faces_dir = "known_faces"
api_url = "http://localhost:3000/api/clock-in-out"

# Trackers for face detection duration
face_detection_start_times = {}
DETECTION_THRESHOLD = 3  # seconds

# Success message variables
show_success_message = False
api_response_message = ""
success_message_time = 0
SUCCESS_MESSAGE_DURATION = 2  # seconds

# Initialize arrays to hold face encodings and names
known_face_encodings = []
known_face_names = []

# Loop through each person in the known faces directory
for person_name in os.listdir(known_faces_dir):
    person_dir = os.path.join(known_faces_dir, person_name)

    # Loop through each image file for the person
    for image_name in os.listdir(person_dir):
        image_path = os.path.join(person_dir, image_name)

        # Load the image
        image = face_recognition.load_image_file(image_path)

        # Encode the face in the image
        face_encodings = face_recognition.face_encodings(image)

        # There might be more than one face in the image, we take the first one
        if face_encodings:
            known_face_encodings.append(face_encodings[0])
            known_face_names.append(person_name)

print(f"Loaded {len(known_face_encodings)} faces from {len(os.listdir(known_faces_dir))} people.")

# Initialize some variables
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

# Initialize the video capture object
video_capture = cv2.VideoCapture(0)

while True:
    # Grab a single frame of video
    ret, frame = video_capture.read()

    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    if process_this_frame:
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(
            rgb_small_frame, face_locations)

        # Initialize an array for the names of detected faces
        face_names = []

        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(
                known_face_encodings, face_encoding)
            name = "Unknown"

            # Use the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(
                known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                if face_distances[best_match_index] < 0.4:
                    name = known_face_names[best_match_index]

            face_names.append(name)

            # Track face detection duration
            if name != "Unknown":
                if name not in face_detection_start_times:
                    face_detection_start_times[name] = time.time()
                else:
                    elapsed_time = time.time() - \
                        face_detection_start_times[name]
                    if elapsed_time >= DETECTION_THRESHOLD:
                        # Send request to API
                        response = requests.post(
                            api_url, json={"employeeId": name})
                        if response.status_code == 200:
                            print(
                                f"Sent request to API for {name}, response: {response.status_code}")
                            show_success_message = True
                            response_json = response.json()
                            message = response_json["message"]["message"]
                            api_response_message = f"{name} is {message}"
                            success_message_time = time.time()

                        # Reset the start time to prevent continuous sending
                        face_detection_start_times[name] = time.time()
            else:
                # Reset the detection time if the face is not continuously detected
                if name in face_detection_start_times:
                    del face_detection_start_times[name]

    process_this_frame = not process_this_frame

    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up face locations since the frame we detected in was scaled to 1/4 size
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35),
                      (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6),
                    font, 1.0, (255, 255, 255), 1)

        # Display the success message
        if show_success_message:
            elapsed_time = time.time() - success_message_time
            if elapsed_time <= SUCCESS_MESSAGE_DURATION:
                cv2.putText(frame, api_response_message, (50, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            else:
                show_success_message = False

    # Display the resulting image
    cv2.imshow('Video', frame)

    # Hit 'q' on the keyboard to quit!
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release handle to the webcam
video_capture.release()
cv2.destroyAllWindows()
