import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import ProductFilter from "./ProductFilter";
import { PER_PAGE } from "../../constants";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import type { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";

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

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
  });

  const { data: products, isFetching,isError,error} = useQuery({
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

      console.log(chanedFilterFileds)

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
      </Space>

      <Form form={filterForm} onFieldsChange={onFilterChange}>
        <ProductFilter>
          <Button onClick={() => {}} type="primary" icon={<PlusOutlined />}>
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
            render: () => {
              return (
                <Space>
                  <Button onClick={() => {}} type="link">
                    Edit
                  </Button>
                </Space>
              );
            },
          },
        ]}
        rowKey={"_id"}
      />
    </>
  );
};

export default Products;
