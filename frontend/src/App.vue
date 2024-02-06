<script setup lang="ts">
    import {Ref, ref} from "vue"

    import {getDocument, GlobalWorkerOptions} from "pdfjs-dist"

    GlobalWorkerOptions.workerSrc = "../node_modules/pdfjs-dist/build/pdf.worker.mjs"

    import { getFetching, doFetching } from "./utils/fetcher";
    import {validateFile} from "./utils/uploadFile.ts"

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    const MAX_UPLOAD_BYTES = 1000000
    const ACCEPTED_FILE_TYPES = [".pdf","application/pdf"]

    const acceptedFileTypes = ACCEPTED_FILE_TYPES.join(",")

    const uploadMessage: Ref<string|null> = ref(null)
    const noFileMessage = "Upload a .pdf file"
    const multiFileMessage = "Only one file allowed"
    const invalidFileMessage = "File provided must be .pdf format"
    const readyFileMessage = "Upload ready"

    const resumeInputMessage = ref(noFileMessage)
    const descriptionInputMessage = ref(noFileMessage)

    const handleFileChange = (event: Event, feedback: Ref<string|null>) => {
        const fileInput = event.target as HTMLInputElement
        if (fileInput.files === null || fileInput.files.length === 0) {
            feedback.value = noFileMessage
            return
        }

        if (fileInput.files.length > 1) {
            feedback.value = multiFileMessage
            return
        }

        if (false === fileInput.checkValidity()){
            feedback.value = invalidFileMessage
            fileInput.reportValidity()
            return
        }

        const uploadFile = fileInput.files[0]

        const {isValid} = validateFile(uploadFile, MAX_UPLOAD_BYTES, ACCEPTED_FILE_TYPES)

        if (!isValid) {
            feedback.value = invalidFileMessage
            return
        }

        feedback.value = readyFileMessage
    }

    const handleResumeChange = (event: Event) => {
        return handleFileChange(event, resumeInputMessage)
    }

    const handleDescriptionChange = (event: Event) => {
        return handleFileChange(event, descriptionInputMessage)
    }

    const gradeString = (grade:string) => {
        return `Resume uploaded is ${grade}% relevant`
    }

    const handleSubmit = async(event: Event) => {
        if (getFetching() === true) {
            return
        }

        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const formDataFiles = Object.fromEntries(formData)

        const fileStrings = {} as Record<string, string>
        for (let [key, value] of Object.entries(formDataFiles)){
            if (typeof value === "string") {
                uploadMessage.value = "How did you upload a string bro?"
                return
            }

            const {isValid, message} = validateFile(value, MAX_UPLOAD_BYTES, ACCEPTED_FILE_TYPES)

            if (!isValid) {
                uploadMessage.value = message
                return
            }

            const pdfBuf = await value.arrayBuffer()
            const pdf = getDocument(pdfBuf)

            const loadedPdf = await pdf.promise
            const totPages = loadedPdf.numPages

            let pdfText = ""
            for (let i=1; i<=totPages; i++) {
                const pageX = await loadedPdf.getPage(i)
                const xText = await pageX.getTextContent()

                for (let j=0; j<xText.items.length; j++) {
                    const txtItem = xText.items[j]
                    if (txtItem.hasOwnProperty("str") === false){
                        continue
                    }

                    //@ts-ignore
                    pdfText = `${pdfText}${txtItem.str}\n`
                }
            }

            fileStrings[key] = pdfText
        }

        const url = new URL(`${BACKEND_URL}/api/v1/grade`)

        const fetchOptions = {
            method: "POST",
            body: JSON.stringify(fileStrings)
        }

        const {success, message, value} = await doFetching(url, fetchOptions)
    
        if (!success) {
            uploadMessage.value = message
            return
        }

        if (!value.score) {
            uploadMessage.value = value.message
            return
        }

        uploadMessage.value = gradeString(value.score)
    }
</script>

<template>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <label for="resume">
            Resume File:
        </label>
        <p>
            {{resumeInputMessage}}
        </p>
        <input @change="handleResumeChange($event)" type="file" id="resume" name="resume" required :accept="acceptedFileTypes" />
        <br>
        <label for="description">
            Description File:
        </label>
        <p>
            {{descriptionInputMessage}}
        </p>
        <input @change="handleDescriptionChange($event)" type="file" id="description" name="description" required :accept="acceptedFileTypes" />
        <br>
        <button type="submit">
            Upload
        </button>
        <p>
            {{uploadMessage}}
        </p>
    </form>
</template>

<style scoped>
</style>
