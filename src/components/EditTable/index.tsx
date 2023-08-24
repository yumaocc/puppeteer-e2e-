import { Form, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Column from 'antd/es/table/Column';

interface EditTableProps<T = any> {
  columns: ColumnsType<T[]>;
  data: any;
}
export default function EditTable<T>(props: EditTableProps<T>) {
  const { columns, data } = props;
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Form.Item name="table">
        <Table dataSource={data}>
          {columns.map((item, index) => {
            const { dataIndex, render, ...rest, rules, initialValue } = item;
            if (!render) {
              return data[index][dataIndex];
            }

            return (
              <Form.Item
                name={['table', index, dataIndex]}
                rules={rules}
                initialValue={initialValue}
              >
                <Column {...rest}>
                  {/* //避免ts报错 */}
                  {render
                    ? render?.(data?.[index]?.[dataIndex], data?.[index], index)
                    : data[index]}
                </Column>
              </Form.Item>
            );
          })}
        </Table>
      </Form.Item>
    </Form>
  );
}
