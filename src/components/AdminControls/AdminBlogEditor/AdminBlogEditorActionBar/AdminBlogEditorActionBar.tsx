'use client'

import {
  ActionIcon,
  Button,
  ButtonProps,
  Card,
  Group,
  Menu,
  MenuItemProps,
} from '@mantine/core'
import {
  IconDeviceFloppy,
  IconDotsVertical,
  IconEye,
  IconEyeClosed,
  IconPencil,
  IconUpload,
} from '@tabler/icons-react'

import classes from './AdminBlogEditorActionBar.module.css'

interface IAdminBlogEditorActionBar {
  togglePreview: () => void
  isSubmitting: boolean
  isPreview: boolean
  isPublished: boolean
  formId: string
}

type TElementProps = ButtonProps &
  MenuItemProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>

const AdminBlogEditorActionBar = ({
  togglePreview,
  isSubmitting,
  isPreview,
  isPublished,
  formId,
}: IAdminBlogEditorActionBar) => {
  const previewProps: TElementProps = {
    leftSection: isPreview ? <IconEyeClosed /> : <IconEye />,
    onClick: togglePreview,
    disabled: isSubmitting,
  }

  const saveProps: TElementProps = {
    leftSection: <IconDeviceFloppy />,
    disabled: isSubmitting,
    type: 'submit',
    value: 'save',
    form: formId,
  }

  const publishProps: TElementProps = {
    leftSection: isPublished ? <IconPencil /> : <IconUpload />,
    disabled: isSubmitting,
    type: 'submit',
    value: isPublished ? 'unpublish' : 'publish',
    form: formId,
  }

  const publishText = isPublished ? 'Convert to draft' : 'Publish'

  return (
    <Card className={classes.actionBarCard}>
      <Group visibleFrom="sm" justify="flex-end" px="1rem" py={0}>
        <Button {...previewProps} variant="subtle">
          Toggle Preview
        </Button>
        <Button {...saveProps} variant="subtle">
          Save Changes
        </Button>
        <Button {...publishProps}>{publishText}</Button>
      </Group>

      <Group hiddenFrom="sm" justify="flex-end" px="1rem" py={0}>
        <Menu position="bottom-end" shadow="sm" keepMounted>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item {...previewProps}>Toggle Preview</Menu.Item>
            <Menu.Item {...saveProps}>Save Changes</Menu.Item>
            <Menu.Item {...publishProps}>{publishText}</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  )
}

export default AdminBlogEditorActionBar
