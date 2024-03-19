import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import classes from "./MistForm.module.css";

interface Mist {
    full_name: string;
    phone: number;
    mail: string;
    category: string;
    message: string;
}

function MistForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Mist>({
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<Mist> = async (data) => {
        console.log(data)
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyJpheNdyKCLrGxpp7iKzkQexfvsqHHsFEJa9fd5v3hvyPXlk2h73qPd1Y7UaAJqtB6Lg/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                console.log('Дані успішно відправлені до Google Sheets');
            } else {
                console.error('Помилка при відправці даних до Google Sheets');
            }
        } catch (error) {
            console.error('Помилка при відправці даних до Google Sheets');
        }
    };
    

    const [selectedCategory, setSelectedCategory] = useState("");

    return (
        <div className={classes.form}>
            <h2 className={classes.form_header}>
                <img
                    alt="Logotype Museum"
                    src="https://mist-next.vercel.app/_next/static/media/museum.25fa7a9e.svg"
                ></img>
            </h2>
            <div className={classes.main_form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Як до вас звертатися?<span className={classes.required}>*</span></label>
                    <input
                        type="text"
                        {...register("full_name", { required: true })}
                        placeholder="ПІБ"
                    ></input>
                    {errors.full_name && (
                        <span className={classes.form_error}>
                            Це поле є обов'язковим
                            <br />
                        </span>
                    )}

                    <label>Ваш контактний номер телефону</label>
                    <input
                        type="phone"
                        {...register("phone", { required: false, pattern: /^\d{12}$/ })}
                        placeholder="Телефон"
                    ></input>
                    {errors.phone && (
                        <span className={classes.form_error}>
                            Це поле повинно містити 12 цифр
                            <br />
                        </span>
                    )}

                    <label>Ваша електронна пошта<span className={classes.required}>*</span></label>
                    <input
                        type="email"
                        {...register("mail", {
                            required: true,
                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        })}
                        placeholder="Електронна пошта"
                    ></input>
                    {errors.mail && (
                        <span className={classes.form_error}>
                            Неправильний формат електронної пошти
                            <br />
                        </span>
                    )}

                    <label>
                        Оберіть категорію звернення<span className={classes.required}>*</span>
                        <br />
                    </label>
                    <select
                        {...register("category", {
                            validate: (value) => value !== 'Оберіть категорію',
                        })}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="Оберіть категорію">Оберіть категорію</option>
                        <option value="Питання">Питання</option>
                        <option value="Відгук">Відгук</option>
                        <option value="Пропозиція">Пропозиція</option>
                        <option value="Скарга">Скарга</option>
                        <option value="Інше">Інше</option>
                    </select>
                    {errors.category && errors.category.type === "validate" && (
                        <span className={classes.form_error}>
                            Поле "Оберіть категорію звернення" є обов'язковим
                        </span>
                    )}

                    <label>Додаткова інформація щодо вашого звернення</label>
                    <textarea
                        className={classes.fixed_textarea}
                        {...register("message", { required: false })}
                    ></textarea>
                    {errors.message && (
                        <span className={classes.form_error}>
                            Поле "Додаткова інформація щодо вашого звернення" є обов'язковим
                            <br />
                        </span>
                    )}
                    <div className={classes.checkbox_wrapper}>
                    <input type="checkbox" id="agree" required />
                    <label htmlFor="agree">
                        Даю згоду на обробку персональних даних
                    </label>
                    </div>
                    <div className={classes.buttons}>
                        <button type="reset" className={classes.btn_clear}>
                            Очистити
                        </button>
                        <button className={classes.btn_submit} type="submit">
                            Надіслати
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MistForm;
