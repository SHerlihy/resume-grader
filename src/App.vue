<script setup lang="ts">
    import {Ref, ref} from "vue"

    import { getFetching, doFetching } from "./utils/fetcher";

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
    const MAX_UPLOAD_BYTES = 1000000
    //const ACCEPTED_FILE_TYPES = [".doc",".docx",".xml","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".pdf","application/pdf"]
    const ACCEPTED_FILE_TYPES = [".pdf","application/pdf"]

    const acceptedFileTypes = ACCEPTED_FILE_TYPES.join(",")

    const uploadMessage: Ref<string|null> = ref(null)
    const noResumeMessage = "Upload a .doc or .pdf file"
    const multiResumeMessage = "Only one file allowed"
    const invalidResumeMessage = "File provided must be .doc or .pdf format"
    const readyResumeMessage = "Upload ready"
    const resumeInputMessage = ref(noResumeMessage)

    const validateFile = (file: File) => {
        if (file.size > MAX_UPLOAD_BYTES) {
            return {
                isValid: false,
                message: `max file size ${MAX_UPLOAD_BYTES} less than file size ${file.size}`
            }
        }

        if (false === ACCEPTED_FILE_TYPES.includes(file.type)) {
            return {
                isValid: false,
                message: `file type ${file.type} not accepted`
            }
        }
            return {
                isValid: true,
                message: `file type ${file.type} accepted`
            }
    }

    const handleResumeChange = (event: Event) => {
        const fileInput = event.target as HTMLInputElement
        if (fileInput.files === null || fileInput.files.length === 0) {
            resumeInputMessage.value = noResumeMessage
            return
        }

        if (fileInput.files.length > 1) {
            resumeInputMessage.value = multiResumeMessage
            return
        }

        if (false === fileInput.checkValidity()){
            resumeInputMessage.value = invalidResumeMessage
            fileInput.reportValidity()
            return
        }


        const resumeFile = fileInput.files[0]

        const {isValid} = validateFile(resumeFile)

        if (!isValid) {
            resumeInputMessage.value = invalidResumeMessage
            return
        }

        resumeInputMessage.value = readyResumeMessage
    }

    const handleSubmit = async(event: Event) => {
        if (getFetching() === true) {
            return
        }

        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const formDataFiles = Object.fromEntries(formData)

        console.log("pre valid")
        for (const [_, value] of Object.entries(formDataFiles)){
            const {isValid, message} = validateFile(value as File)

            if (!isValid) {
                uploadMessage.value = message
                return
            }
        }
        console.log("post valid")

        const url = new URL(`${BACKEND_URL}/api/v1/grade`)

        const fetchOptions = {
            method: "POST",
            body: formData
        }

        console.log("pre fetch")

        const {success, message} = await doFetching(url, fetchOptions)

        uploadMessage.value = message

        if (!success) {
            //err
            return
        }

        //pass value
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
