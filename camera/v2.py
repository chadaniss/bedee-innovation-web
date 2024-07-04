import os
import cv2
import time
import requests

# Directory containing known faces
known_faces_dir = "known_faces"

# API URL for clock-in/clock-out
api_url = "http://localhost:3000/api/clock-in-out"

# Similarity threshold for face recognition
SIMILARITY_THRESHOLD = 0.7

# Trackers for face detection duration
face_detection_start_times = {}
DETECTION_THRESHOLD = 3  # seconds

# Success message variables
show_success_message = False
api_response_message = ""
success_message_time = 0
SUCCESS_MESSAGE_DURATION = 3  # seconds

# Initialize arrays to hold face encodings and names
known_face_encodings = []
known_face_names = []

# Initialize the YuNet face detector and SFace face recognizer
detector = cv2.FaceDetectorYN.create("./models/face_detection_yunet_2022mar.onnx", "", (320, 320))
detector.setScoreThreshold(0.9)
recognizer = cv2.FaceRecognizerSF.create("./models/face_recognition_sface_2021dec.onnx", "")

# Load known faces and encode them
for person_name in os.listdir(known_faces_dir):
    person_dir = os.path.join(known_faces_dir, person_name)
    for image_name in os.listdir(person_dir):
        image_path = os.path.join(person_dir, image_name)
        image = cv2.imread(image_path)
        # Resize image if width is greater than 1000 pixels
        if image.shape[1] > 1000:
            aspect_ratio = image.shape[0] / image.shape[1]
            new_width = 1000
            new_height = int(new_width * aspect_ratio)
            image = cv2.resize(image, (new_width, new_height))
        detector.setInputSize((image.shape[1], image.shape[0]))  # Set input size to frame size
        results = detector.detect(image)
        if results[1] is not None:
            face = results[1][0]
            aligned_face = recognizer.alignCrop(image, face)
            face_encoding = recognizer.feature(aligned_face)
            known_face_encodings.append(face_encoding)
            known_face_names.append(person_name)

print(f"Loaded {len(known_face_encodings)} faces from {len(os.listdir(known_faces_dir))} people.")

# Initialize some variables
process_this_frame = True
last_seen_face = {}
unknown = "Unknown"

# Initialize the video capture object
video_capture = cv2.VideoCapture(0)

while True:
    start_time = time.time()
    ret, frame = video_capture.read()

    if process_this_frame:
        detection_start_time = time.time()
        detector.setInputSize((frame.shape[1], frame.shape[0]))  # Set input size to frame size
        results = detector.detect(frame)
        detection_end_time = time.time()
        detection_duration = detection_end_time - detection_start_time
        print(f"Face detection took {detection_duration:.6f} seconds")

        face_names = []
        if results[1] is not None:
            for face in results[1]:
                recognition_start_time = time.time()
                aligned_face = recognizer.alignCrop(frame, face)
                face_encoding = recognizer.feature(aligned_face)
                similarity = 0.0
                known_face_index = None
                for index, known_face in enumerate(known_face_encodings):
                    score = recognizer.match(known_face, face_encoding, cv2.FaceRecognizerSF_FR_COSINE)
                    if score > similarity:
                        similarity = score
                        known_face_index = index

                if similarity > SIMILARITY_THRESHOLD:
                    name = known_face_names[known_face_index]
                else:
                    name = unknown
                face_names.append(name)
                recognition_end_time = time.time()
                recognition_duration = recognition_end_time - recognition_start_time
                print(f"Face recognition took {recognition_duration:.6f} seconds")

                if name != unknown:
                    if name not in face_detection_start_times:
                        face_detection_start_times[name] = time.time()
                    else:
                        elapsed_time = time.time() - face_detection_start_times[name]
                        if elapsed_time >= DETECTION_THRESHOLD:
                            if name not in last_seen_face or time.time() - last_seen_face[name] > 60:
                                response = requests.post(api_url, json={"employeeId": name})
                                if response.status_code == 200:
                                    print(f"Sent request to API for {name}, response: {response.status_code}")
                                    show_success_message = True
                                    response_json = response.json()
                                    message = response_json["message"]["message"]
                                    api_response_message = f"{name} is {message}"
                                    success_message_time = time.time()
                                    last_seen_face[name] = time.time()
                            face_detection_start_times[name] = time.time()
                else:
                    if name in face_detection_start_times:
                        del face_detection_start_times[name]

    process_this_frame = not process_this_frame

    if results[1] is not None:
        for (face, name) in zip(results[1], face_names):
            box = face[:4].astype(int)
            color = (0, 255, 0) if name != unknown else (0, 0, 255)
            cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), color, 2)
            cv2.rectangle(frame, (box[0], box[1] + box[3] - 35), (box[0] + box[2], box[1] + box[3]), color, cv2.FILLED)
            cv2.putText(frame, name, (box[0] + 6, box[1] + box[3] - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)

    if show_success_message:
        elapsed_time = time.time() - success_message_time
        if elapsed_time <= SUCCESS_MESSAGE_DURATION:
            cv2.putText(frame, api_response_message, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            show_success_message = False

    cv2.imshow('Video', frame)
    total_duration = time.time() - start_time
    print(f"Total frame processing took {total_duration:.6f} seconds")

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
