from tkinter import Frame, Tk, Label, Button, filedialog

from PIL import Image, ImageTk
import os
import cv2
import numpy as np
import matplotlib.pyplot as plt

window = Tk()
window.configure(bg="black")
window.attributes('-fullscreen', True)

title_frame = Frame(window, background="black")
title_frame.pack(side="top", fill="both", pady=(40, 0))
title_label = Label(title_frame, text="image processing".upper(), fg="white")
title_label.configure(font=("Times", 20), background="black")
title_label.pack(fill='both')

main_buttons_frame = Frame(window, background="black")
main_buttons_frame.pack(side="top", pady=40)

image_extensions = ['.jpg', '.jpeg', '.png']
current_image_label = Label()
converted_image_label = Label()
current_image = None
converted_image = None


def show_image(image, image_name, main_image=True):
    global current_image_label
    global converted_image_label
    resized_image = cv2.resize(image, (565, 540))
    image_tk = ImageTk.PhotoImage(image=Image.fromarray(resized_image))
    converted_image_label.destroy()
    if main_image:
        current_image_label.destroy()
        current_image_label = Label(current_image_frame if main_image else converted_image_frame, image=image_tk,
                                    background="black", text=image_name)
        current_image_label.image = image_tk
        current_image_label.pack(fill='both', expand=True)
    else:
        converted_image_label = Label(converted_image_frame if main_image else converted_image_frame, image=image_tk,
                                      background="black", text=image_name)
        converted_image_label.image = image_tk
        converted_image_label.pack(fill='both', expand=True)


def open_image():
    file_path = filedialog.askopenfilename()
    if file_path:
        _, file_extension = os.path.splitext(file_path)
        if file_extension.lower() not in image_extensions:
            return
        global current_image
        current_image = cv2.imread(file_path)
        current_image = cv2.cvtColor(current_image, cv2.COLOR_BGR2RGB)
        show_image(current_image, os.path.basename(file_path))


def compress_and_save():
    global converted_image
    if (converted_image is None):
        return
    file_path = filedialog.asksaveasfilename(defaultextension=".jpg",
                                             filetypes=[("JPEG", "*.jpg")])
    if not file_path:
        return
    _, encoded_image = cv2.imencode(
        ".jpg", converted_image, [int(cv2.IMWRITE_JPEG_QUALITY), 50])
    # cv2.imwrite("../img/compressed/c"+image_label.cget("text"), converted_image)
    with open(file_path, "wb") as file:
        file.write(encoded_image)


load_image_button = Button(
    main_buttons_frame, text="Load image", command=open_image, width=20, height=2, font=("Times", 16))
load_image_button.pack(side="left", padx=(0, 100), pady=(10, 0))
compress_and_save_image_button = Button(
    main_buttons_frame, text="Compress&Save", command=compress_and_save, width=20, height=2, font=("Times", 16))
compress_and_save_image_button.pack(side="right", padx=(100, 0), pady=(10, 0))

image_conversion_frame = Frame(window, background="black")
image_conversion_frame.pack(fill="both", expand=True)

threshold_frame = Frame(image_conversion_frame, background="black")
threshold_frame.pack(side="left")

segmentation_frame = Frame(image_conversion_frame, background="black")
segmentation_frame.pack(side="right")


def run_otsu():
    global current_image
    if (current_image is None):
        return
    _, thresh = cv2.threshold(
        cv2.cvtColor(current_image, cv2.COLOR_BGR2GRAY), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    global converted_image
    converted_image = thresh
    global current_image_label
    show_image(converted_image, "otsu_" +
               current_image_label.cget("text"), False)


def analyze_histogram():
    global current_image
    threshold = 128
    epsilon = 1
    if (current_image is None):
        return
    while True:
        _, binary_image = cv2.threshold(
            cv2.cvtColor(current_image, cv2.COLOR_BGR2GRAY), threshold, 255, cv2.THRESH_BINARY)
        G1 = current_image[np.where(binary_image > threshold)]
        G2 = current_image[np.where(binary_image <= threshold)]
        mean1 = np.mean(G1)
        mean2 = np.mean(G2)
        new_threshold = int((mean1 + mean2) / 2)
        if abs(new_threshold - threshold) < epsilon:
            break
        threshold = new_threshold
    _, threshold_image = cv2.threshold(
        cv2.cvtColor(current_image, cv2.COLOR_BGR2GRAY), threshold, 255, cv2.THRESH_BINARY)
    global converted_image
    converted_image = threshold_image
    global current_image_label
    show_image(converted_image, "histogram_" +
               current_image_label.cget("text"), False)
    histogram = cv2.calcHist([cv2.cvtColor(current_image, cv2.COLOR_BGR2GRAY)], [
                             0], None, [256], [0, 256])
    plt.figure()
    plt.title('Histogram')
    plt.xlabel('Pixel Value')
    plt.ylabel('Frequency')
    plt.plot(histogram)
    plt.show()


otsu_button = Button(threshold_frame, text="Otsu",
                     command=run_otsu, width=15, height=2, font=("Times", 15))
otsu_button.pack(padx=(15, 10), pady=10)
histogram_button = Button(threshold_frame, text="Histogram",
                          command=analyze_histogram, width=15, height=2, font=("Times", 15))
histogram_button.pack(padx=(15, 10), pady=10)


def run_canny():
    global converted_image
    converted_image = cv2.Canny(cv2.cvtColor(
        current_image, cv2.COLOR_RGB2GRAY), 100, 200)
    global current_image_label
    show_image(converted_image, "Canny_" +
               current_image_label.cget("text"), False)


def find_dots():
    global converted_image
    converted_image = cv2.cvtColor(
        current_image, cv2.COLOR_RGB2GRAY)
    corner_detector = cv2.cornerHarris(
        converted_image, blockSize=2, ksize=3, k=0.04)
    threshold = 0.0001 * corner_detector.max()
    points = []
    for i in range(corner_detector.shape[0]):
        for j in range(corner_detector.shape[1]):
            if corner_detector[i, j] > threshold:
                points.append((j, i))
    for point in points:
        x, y = point
        cv2.drawMarker(converted_image, (x, y), (0, 255, 0), markerType=cv2.MARKER_CROSS,
                       markerSize=30, thickness=10, line_type=cv2.LINE_AA)
    global current_image_label
    show_image(converted_image, "Canny_" +
               current_image_label.cget("text"), False)


run_canny_button = Button(segmentation_frame, text="Run Canny algorithm",
                          command=run_canny, width=15, height=2, font=("Times", 15))
run_canny_button.pack(padx=(10, 15), pady=10)

find_dots_button = Button(segmentation_frame, text="Find dots",
                          command=find_dots, width=15, height=2, font=("Times", 15))
find_dots_button.pack(padx=(10, 15), pady=10)

current_image_frame = Frame(image_conversion_frame, width=565,
                            height=540, background="black")
current_image_frame.pack(side="left")

converted_image_frame = Frame(image_conversion_frame, width=565,
                              height=540, background="black")
converted_image_frame.pack(side="right")

exit_frame = Frame(window, background="black")
exit_frame.pack(side="bottom")


def exit():
    window.destroy()


exit_button = Button(exit_frame, text="exit".upper(),
                     command=exit, width=30, height=1, font=("Times", 15), fg="red")
exit_button.pack(side='bottom', pady=(20, 30))

window.mainloop()
