import React, { useState } from 'react'
import { useRequest, useParams, history } from 'umi'
import { getProject, updateProject, deleteProject } from '@/services/project'
import { Divider, Button, Space, Typography, Form, Input, Skeleton, Modal, message } from 'antd'

const ProjectDangerAction: React.FC<{ project: Project }> = ({ project }) => {
  const { projectId } = useParams<any>()
  const [modalVisible, setModalVisible] = useState(false)
  const [projectName, setProjectName] = useState('')

  // 删除资源池
  const { run, loading } = useRequest(
    async () => {
      await deleteProject(projectId)
      setModalVisible(false)
      message.success('删除资源池成功')
      setTimeout(() => {
        history.push('/home')
      }, 2000)
    },
    {
      manual: true,
    }
  )

  return (
    <>
      <Typography.Title level={3}>危险操作</Typography.Title>
      <Divider />
      <Button
        danger
        type="primary"
        onClick={() => {
          setModalVisible(true)
        }}
      >
        删除资源池
      </Button>
      <Modal
        centered
        title="删除资源池"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => run()}
        okButtonProps={{
          loading,
          disabled: projectName !== project.name,
        }}
      >
        <Space direction="vertical">
          <Typography.Paragraph strong>
            删除资源池会删除资源池中的资源模型及资源服务等数据
          </Typography.Paragraph>
          <Typography.Paragraph strong>
            删除资源池是不能恢复的，您确定要删除此资源池吗？
            如果您想继续，请在下面的方框中输入此资源池的名称：
            <Typography.Text strong mark>
              {project.name}
            </Typography.Text>
          </Typography.Paragraph>
          <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </Space>
      </Modal>
    </>
  )
}

export default (): React.ReactElement => {
  const { projectId } = useParams<any>()
  const [reload, setReload] = useState(0)
  const [changed, setChanged] = useState(false)
  const { data: project, loading } = useRequest<{ data: Project }>(() => getProject(projectId), {
    refreshDeps: [reload],
  })

  const { run, loading: updateLoading } = useRequest(
    async (payload: Partial<Project>) => {
      await updateProject(projectId, payload)
      setChanged(false)
      setReload(reload + 1)
      message.success('资源池更新成功！')
    },
    {
      manual: true,
    }
  )

  if (loading || !project) {
    return <Skeleton />
  }

  return (
    <>
      <Typography.Title level={3}>资源池信息</Typography.Title>
      <Divider />
      <Form
        name="basic"
        layout="vertical"
        labelAlign="left"
        initialValues={project}
        onFinish={(v = {}) => {
          run(v)
        }}
        onValuesChange={(_, v: Partial<Project>) => {
          if (v.name !== project?.name || v.description !== project.description) {
            setChanged(true)
          } else {
            setChanged(false)
          }
        }}
      >
        <Form.Item label="资源池 Id">
          <Typography.Paragraph copyable>{project?._id}</Typography.Paragraph>
        </Form.Item>
        <Form.Item
          label="资源池名称"
          name="name"
          rules={[{ required: true, message: '请输入资源池名称！' }]}
        >
          <Input placeholder="资源池名称，如研发服务" />
        </Form.Item>

        <Form.Item label="资源池介绍" name="description">
          <Input placeholder="资源池介绍，如研发服务资源池" />
        </Form.Item>

        <Form.Item>
          <Space size="large" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit" disabled={!changed} loading={updateLoading}>
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <ProjectDangerAction project={project} />
    </>
  )
}
