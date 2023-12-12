'use client'

import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { forwardRef,useState } from 'react'

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
  function ImageDropzon(props, ref) {
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
        src={file.preview}
        onLoad={() => {
          URL.revokeObjectURL(file.preview)
        }}
        alt={file.name}
        key={file.name}
        width={75}
        height={75}
        radius="sm"
        className="aspect-square"
      />
    ))

    return (
      <Card>
        <CardHeader>{label}</CardHeader>
        <CardBody>
          <input
            {...otherProps}
            ref={ref}
            onChange={onDrop}
            className={`${styles.input} active:bg-slate-100 focus:bg-slate-100 hover:bg-slate-100 hover:cursor-pointer rounded`}
          />
        </CardBody>
        <CardFooter className="flex flex-wrap gap-2">{thumbs}</CardFooter>
      </Card>
    )
  },
)

export default ImageDropzone
