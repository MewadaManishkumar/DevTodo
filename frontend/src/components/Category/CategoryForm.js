import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CategoryForm = () => {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    //Get Api call for selected category data
    useEffect(() => {
        const getCategory = async () => {
            const response = await axios.get(`http://localhost:8000/todolist/category/${_id}`);
            form.setFieldsValue({
                name: response.data.name
            });
        }
        if (_id) {
            getCategory();
        }
    }, [form, _id]);

    //put api call for update a blog
    const updateCategory = async (values) => {
        try {
            await axios.put(`http://localhost:8000/todolist/categories/update/${_id}`, values);
            navigate('/todolist/categories')
            message.success('Category updated successfully');
        } catch (error) {
            message.error("This category is already exist!")
        }
    }
    return (
        <>
            {_id && <h1>Update Category</h1>}
            <Form
                layout="vertical"
                form={form}
                onFinish={_id && updateCategory}
                style={{
                    padding: 10,
                    display: 'inline-block',
                    justifyContent: 'center',
                    width: 300,
                }}
                autoComplete="off"
            >
                <Form.Item
                    label="Category Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input category name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    {_id ? <Button type="primary" htmlType="submit">
                        Update Category
                    </Button> : <Button type="primary" htmlType="submit">
                        Add Category
                    </Button>}
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryForm;