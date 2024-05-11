import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = `${import.meta.env.VITE_API_KEY}`;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: "you are a alt-text generator, short texts, in portuguese" });

const INPUT_LABEL = document.getElementById("input-label");
const INPUT = document.getElementById("input");
const OUTPUT = document.getElementById("output");
const HERE = document.getElementById("here");

let isProcessing = false;


INPUT.accept = 'image/*';
INPUT.onchange = async (event) => {
  onChangeHandler(event.target.files[0])
};

async function onChangeHandler(file) {
  console.log(file);
  if (!isProcessing && file.type.startsWith("image/")) {
    console.log("running");
    convertImageToBase64(file, async (base64String) => {
      await getAltText(base64String, file.type)
    });
  }
}

async function getAltText(imageData, type) {
  isProcessing = true
  loading()
  const prompt = "";
  const image = {
    inlineData: {
      data: imageData,
      mimeType: type,
    },
  };

  const result = await model.generateContent([prompt, image]);

  await sleep(8000)
  isProcessing = false
  OUTPUT.textContent = result.response.text()
}

async function convertImageToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = async (event) => {
    INPUT_LABEL.innerHTML = `<img class="absolute inset-0 w-full h-full object-contain" id="image" src="${event.target.result}" alt="">`
    const base64String = reader.result.split(',')[1];
    await callback(base64String);
  };
  reader.readAsDataURL(file);
}

async function loading() {
  const chars = ["-", "\\", "|", '/']
  while (isProcessing) {
    for (const char of chars) {
      if (isProcessing) {
        OUTPUT.textContent = char
      }
      await sleep(200)
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}





['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  INPUT_LABEL.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  INPUT_LABEL.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  INPUT_LABEL.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  INPUT_LABEL.classList.add('highlight');
}

function unhighlight(e) {
  INPUT_LABEL.classList.remove('highlight');
}

INPUT_LABEL.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  onChangeHandler(files[0])
}

HERE.innerHTML = atob(`ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAsLS0tLCAgICAgICAgICAgLC0tLS0uLiAgICAgICAgICAgICAgICAgICAgICAsLS0tLCAKICAnICAuJyBcICAgICAgICAgLyAgIC8gICBcICAgICAgICAgICAgICwtLSwgLGAtLS4nIHwgCiAvICA7ICAgICcuICAgICAgLyAgIC4gICAgIDogICAgICAgICAgLCdfIC98IHwgICA6ICA6IAo6ICA6ICAgICAgIFwgICAgLiAgIC8gICA7LiAgXCAgICAuLS0uIHwgIHwgOiA6ICAgfCAgJyAKOiAgfCAgIC9cICAgXCAgLiAgIDsgICAvICBgIDsgICwnXyAvfCA6ICAuIHwgfCAgIDogIHwgCnwgIDogICcgOy4gICA6IDsgICB8ICA7IFwgOyB8ICB8ICAnIHwgfCAgLiAuICcgICAnICA7IAp8ICB8ICA7LyAgXCAgIFx8ICAgOiAgfCA7IHwgJyAgfCAgfCAnIHwgIHwgfCB8ICAgfCAgfCAKJyAgOiAgfCBcICBcICwnLiAgIHwgICcgJyAnIDogIDogIHwgfCA6ICAnIDsgJyAgIDogIDsgCnwgIHwgICcgICctLScgICcgICA7ICBcOyAvICB8ICB8ICA7ICcgfCAgfCAnIHwgICB8ICAnIAp8ICA6ICA6ICAgICAgICAgXCAgIFwgICcsICAuIFwgOiAgfCA6IDsgIDsgfCAnICAgOiAgfCAKfCAgfCAsJyAgICAgICAgICA7ICAgOiAgICAgIDsgfCcgIDogIGAtLScgICBcOyAgIHwuJyAgCmAtLScnICAgICAgICAgICAgIFwgICBcIC4nYC0tIiA6ICAsICAgICAgLi0uLyctLS0nICAgIAogICAgICAgICAgICAgICAgICAgYC0tLWAgICAgICAgIGAtLWAtLS0tJyAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg`)