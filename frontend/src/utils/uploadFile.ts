export const validateFile = (file: File, maxBytes: number, validTypes: string[]) => {
    if (file.size > maxBytes) {
        return {
            isValid: false,
            message: `max file size ${maxBytes} less than file size ${file.size}`
        }
    }

    if (false === validTypes.includes(file.type)) {
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

