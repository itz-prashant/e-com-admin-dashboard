import {
  Form,
  message,
  Space,
  Typography,
  Upload,
  type UploadProps,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage = ({initialImage}:{initialImage:string}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const form = Form.useFormInstance();

  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        messageApi.error("You can upload only Jpeg or Png");
      }

      setImageUrl(URL.createObjectURL(file));
      form.setFieldValue("image", {
        file: file,
      });
      return false;
    },
  };
  return (
    <Form.Item
      label=""
      name="image"
      rules={[
        {
          required: true,
          message: "Please upload a product image",
        },
      ]}
    >
      <Upload listType="picture-card" {...uploaderConfig}>
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="product-image" height={100} />
        ) : (
          <Space vertical>
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
