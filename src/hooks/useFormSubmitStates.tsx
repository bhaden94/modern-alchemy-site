import { useMemo, useState } from 'react'

export const useFormSubmitStates = () => {
  const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false)

  const isSubmitting = useMemo(
    () => isUploadingImages || isSubmittingForm || isSendingEmail,
    [isUploadingImages, isSubmittingForm, isSendingEmail],
  )

  const customOverlayLoaderText = useMemo(() => {
    if (isUploadingImages) return 'Uploading images'
    if (isSubmittingForm) return 'Submitting booking'
    return 'Sending artist email'
  }, [isUploadingImages, isSubmittingForm])

  return {
    isUploadingImages,
    setIsUploadingImages,
    isSubmittingForm,
    setIsSubmittingForm,
    isSendingEmail,
    setIsSendingEmail,
    isSubmitting,
    customOverlayLoaderText,
  }
}
