import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ProductFilter from "./ProductFilter";
import { PER_PAGE } from "../../constants";
import { useEffect, useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import type { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helper";

const columns = [
  {
    title: "Product name",
    dataIndex: "name",
    key: "name",
    render: (_text: boolean, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} src={`${record.image}`} preview={false} />
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublished",
    key: "isPublished",
    render: (_text: string, record: Product) => {
      return (
        <>
          {record.isPublished ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:MM")}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const [filterForm] = Form.useForm();

  const { user } = useAuthStore();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [ selectedProduct, setCurrentProduct] = useState<Product | null>(null)

  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user.role === "manager" ? user?.tenant.id : undefined,
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();


  useEffect(()=>{
    if (!selectedProduct) return;
    if(selectedProduct){

      const priceConfiguration = Object.entries(selectedProduct.priceConfiguration).reduce((acc,[key, value])=>{
        const sytingiFiedKey = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType
        })
        return{
          ...acc,
          [sytingiFiedKey] : value.availableOptions
        }
      },{})

     const attributes = selectedProduct.attributes.reduce((acc, item)=>{
      return{
        ...acc,
        [item.name]: item.value
      }
     },{})

     form.setFieldsValue({
      ...selectedProduct,
      priceConfiguration,
      attributes,
      categoryId: selectedProduct.category._id
     })

    }
  },[selectedProduct, form])

  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filterParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: productMutate, isPending} = useMutation({
    mutationKey: ["create-product"],
    mutationFn: async (data: FormData) => {
      if(selectedProduct){
        return updateProduct(selectedProduct._id,data).then((res) => res.data);
      }else{
       return createProduct(data).then((res) => res.data);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      setDrawerOpen(false);
      return;
    },
  });

  const debounceQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        q: value,
        page: 1,
      }));
    }, 500);
  }, []);

  const onFilterChange = (changeFields: FieldData[]) => {
    const chanedFilterFileds = changeFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in chanedFilterFileds) {
      debounceQUpdate(chanedFilterFileds.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...chanedFilterFileds,
        page: 1,
      }));
    }
  };

  const onHandleSubmit = async () => {
    await form.validateFields();
    const priceConfiguration = form.getFieldValue("priceConfiguration");

    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);

        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: Array.isArray(parsedKey.priceType)
              ? parsedKey.priceType[0]
              : parsedKey.priceType,
            availableOption: value,
          },
        };
      },
      {}
    );

    const categoryId = form.getFieldValue("categoryId");

    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );

    const postData = {
      ...form.getFieldsValue(),
      tenantId: user!.role === "manager" ? user.tenant.id : form.getFieldValue("tenantId") ,
      image: form.getFieldValue("image"),
      isPublished: form.getFieldValue("isPublished") ? true : false,
      categoryId,
      priceConfiguration: pricing,
      attributes,
    };

    const formData = makeFormData(postData);
    productMutate(formData);
  };

  return (
    <>
      <Space style={{ width: "100%" }} size={"large"} vertical>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Products" },
            ]}
          />
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
          {isFetching && (
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductFilter>
            <Button
              onClick={() => setDrawerOpen(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Product
            </Button>
          </ProductFilter>
        </Form>

        <Table
          pagination={{
            total: products?.total,
            pageSize: queryParams.limit,
            current: queryParams.page,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  page: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]} - ${range[1]} of ${total} items`;
            },
          }}
          dataSource={products?.data}
          columns={[
            ...columns,
            {
              title: "Action",
              dataIndex: "action",
              key: "action",
              render: (_, record: Product ) => {
                return (
                  <Space>
                    <Button onClick={() => {
                      setDrawerOpen(true);
                      setCurrentProduct(record)}
                      } type="link">
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          rowKey={"_id"}
        />

        <Drawer
          title={selectedProduct ? "Update Product" :  "Add product"}
          size={720}
          styles={{ body: { background: colorBgLayout } }}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={() => {
            setCurrentProduct(null)
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setCurrentProduct(null)
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit} loading={isPending}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <ProductForm form={form}/>
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
