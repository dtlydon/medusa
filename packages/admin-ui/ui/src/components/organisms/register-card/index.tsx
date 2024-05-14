import { useAdminCustomPost, useAdminLogin, useMedusa } from "medusa-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useWidgets } from "../../../providers/widget-provider"
import { useTranslation } from "react-i18next"
import InputError from "../../atoms/input-error"
import WidgetContainer from "../../extensions/widget-container"
import Button from "../../fundamentals/button"
import SigninInput from "../../molecules/input-signin"
import { Input } from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { User } from "@medusajs/client-types"

type FormValues = {
  email: string
  firstName: string
  lastName: string
  storeName: string
  password: string
}


const RegisterCard = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>()
  const navigate = useNavigate()
  const { mutate, isLoading } = useAdminLogin()
  const { t } = useTranslation()
  const { client } = useMedusa()


  const createStore = useMutation(async (values: FormValues) => {
    const result = await client.client.request('POST', '/store/register', values);
    if (!result?.response || result.response.status !== 200) {
      throw new Error('Failed to create store');
    }
    return result.user as User;
  });

  const { getWidgets } = useWidgets()

  const onSubmit = async (values: FormValues) => {
    const user = await createStore.mutateAsync(values)
    mutate({email: user.email, password: values.password}, {
      onSuccess: () => {
        navigate("/a/orders")
      },
      onError: () => {
        setError(
          "password",
          {
            type: "manual",
            message: t(
              "register-card-no-match",
              "These credentials do not match our records."
            ) as string,
          },
          {
            shouldFocus: true,
          }
        )
      },
    })
  }
  return (
    <div className="gap-y-large flex flex-col">
      {getWidgets("login.before").map((w, i) => {
        return (
          <WidgetContainer
            key={i}
            widget={w}
            injectionZone="login.before"
            entity={undefined}
          />
        )
      })}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <h1 className="inter-xlarge-semibold text-grey-90 mb-large text-[20px]">
            {t("register-card-log-in-to-medusa", "Log in to Medusa")}
          </h1>
          <div>
            <Input
              placeholder={t("register-card-first-name", "First Name") as string}
              {...register("firstName", { required: true })}
              autoComplete="given-name"
              className="mb-small"
            />
            <Input
              placeholder={t("register-card-last-name", "Last Name") as string}
              {...register("lastName", { required: true })}
              autoComplete="family-name"
              className="mb-small"
            />
            <Input
              placeholder={t("register-card-store-name", "Store Name") as string}
              {...register("storeName", { required: true })}
              className="mb-small"
            />
            <SigninInput
              placeholder={t("register-card-email", "Email") as string}
              {...register("email", { required: true })}
              autoComplete="email"
              className="mb-small"
            />
            <SigninInput
              placeholder={t("register-card-password", "Password") as string}
              type={"password"}
              {...register("password", { required: true })}
              autoComplete="current-password"
              className="mb-xsmall"
            />
            <InputError errors={errors} name="password" />
          </div>
          <Button
            className="rounded-rounded inter-base-regular mt-4 w-[280px]"
            variant="secondary"
            size="medium"
            type="submit"
            loading={isLoading}
          >
            Continue
          </Button>
        </div>
      </form>
      {getWidgets("login.after").map((w, i) => {
        return (
          <WidgetContainer
            key={i}
            widget={w}
            injectionZone="login.after"
            entity={undefined}
          />
        )
      })}
    </div>
  )
}

export default RegisterCard
