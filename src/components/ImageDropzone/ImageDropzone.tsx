'use client'

import { Image } from '@mantine/core'
import NextImage from 'next/image'
import { forwardRef, useState } from 'react'

import styles from './ImageDropzone.module.css'

interface ImageDropzoneProps {
  label: string
  type: string
  id: string
  multiple: boolean
  accept: string
}
export type Ref = HTMLInputElement

const ImageDropzone = forwardRef<Ref, ImageDropzoneProps>(
  function ImageDropzone(props, ref) {
    const { label, ...otherProps } = props
    const [files, setFiles] = useState<any[]>()

    const onDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
      const length = e.target.files?.length || 0
      const droppedList: File[] = []

      for (let i = 0; i < length; i++) {
        const currFile =
          e.target.files?.item(i) ||
          new File(['foo'], 'foo.txt', {
            type: 'text/plain',
          })
        droppedList.push(currFile)
      }

      setFiles(
        droppedList.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      )
    }

    const thumbs = files?.map((file) => (
      <Image
        component={NextImage}
        src={file.preview}
        onLoad={() => {
          URL.revokeObjectURL(file.preview)
        }}
        alt={file.name}
        key={file.name}
        width={75}
        height={75}
        w={75}
        h={75}
        radius="md"
        className="aspect-square"
      />
    ))

    // TODO: Move to mantine dropzone component
    return (
      <div>
        <div>{label}</div>
        <div>
          <input
            {...otherProps}
            type="file"
            ref={ref}
            onChange={onDrop}
            className={`${styles.input} active:bg-slate-100 focus:bg-slate-100 hover:bg-slate-100 hover:cursor-pointer rounded`}
          />
        </div>
        <div className="flex flex-wrap gap-2 my-4">{thumbs}</div>
      </div>
    )
  },
)

export default ImageDropzone
