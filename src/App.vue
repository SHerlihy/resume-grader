<script setup lang="ts">
    import {ref} from "vue"

    const BACKEND_URL = import.meta.env.BACKEND_URL
    const MAX_UPLOAD_BYTES = 1000000
    const ACCEPTED_FILE_TYPES = [".doc",".docx",".xml","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".pdf"," application/pdf"]

    const acceptedFileTypes = ACCEPTED_FILE_TYPES.join(",")

    console.log("acceptedFileTypes")
    console.log(acceptedFileTypes)

    const resumeInputMessage = ref("Upload a .doc or .pdf file")
    const invalidResumeMessage = "File provided must be .doc or .pdf format"

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
    }

    const handleResumeChange = (event: Event) => {
        const fileInput = event.target as HTMLInputElement
        if (fileInput.files.length === 0) {
            return
        }

        if (fileInput.files.length > 1) {
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
            return
        }

        resumeInputMessage.value = "Ready to upload"
    }

//    const handleResumeCancel = (event) => {
//        //from invalid to invalid
//        //from valid to valid
//    }

    const handleSubmit = async(event: Event) => {
        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const formDataFiles = Object.fromEntries(formData)

        for (const [_, value] of Object.entries(formDataFiles)){
            const {isValid} = validateFile(value as File)

            if (!isValid) {
                return
            }
        }

        const url = new URL(`${BACKEND_URL}/api/v1/grade`)

        const fetchOptions = {
            method: "POST",
            body: formData
        }

        const response = await fetch(url, fetchOptions)
    }
</script>

<template>
    <!-- <form action="process.env.BACKEND_URL" method="POST"> -->
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
    </form>
</template>

<style scoped>
</style>
