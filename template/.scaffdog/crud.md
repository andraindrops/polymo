---
name: "crud"
root: "."
output: "."
ignore: []
questions:
  name: "Please enter a model name."
  attributes: "Please enter attributes."
---

# `src/pages/{{ inputs.name | plur }}/index.tsx`

```ts
import { requireSignIn } from "@/services/server/auth";

import Page from "@/components/page/{{ inputs.name | plur }}/Index";

export default Page;

export const getServerSideProps = requireSignIn;
```

# `src/pages/{{ inputs.name | plur }}/new.tsx`

```ts
import { requireSignIn } from "@/services/server/auth";

import Page from "@/components/page/{{ inputs.name | plur }}/New";

export default Page;

export const getServerSideProps = requireSignIn;
```

# `src/pages/{{ inputs.name | plur }}/[id].tsx`

```ts
import { GetServerSideProps, GetServerSidePropsContext } from "next";

import { DefaultUser } from "next-auth";
import { getSession } from "next-auth/react";

import Page from "@/components/page/{{ inputs.name | plur }}/Edit";

export default Page;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  | {
      props: {
        user: DefaultUser & {
          id: string;
        };
        id: string | string[];
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
> => {
  const { req, query } = context;

  const session = await getSession({ req });

  const user = session?.user;

  if (user == null || query.id == null) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return { props: { user, id: query.id } };
};
```

# `src/components/page/{{ inputs.name | plur }}/Index.tsx`

```ts
import Link from "next/link";
import { useRouter } from "next/router";

import { {{ inputs.name | pascal }} } from "@/graphql/generated/client";

import { graphql } from "@/libs/graphql";

import { notifyError } from "@/services/client/notifier";

import { Locale } from "@/locales/Locale";

import { useFetch } from "@/hooks/useFetch";

import { Layout } from "@/components/layout/Layout";

import { Loading } from "@/components/ui/app/Loading";
import { Stack } from "@/components/ui/layout/Stack";

import { Index } from "@/components/part/{{ inputs.name | plur }}/Index";

const Page = () => {
  const router = useRouter();

  const { t } = new Locale({ locale: router.locale });

  const { data } = useFetch<{{ inputs.name | pascal }}[] | null>(async () => {
    try {
      const query = await graphql.get{{ inputs.name | plur | pascal }}();
      return query.get{{ inputs.name | plur | pascal }};
    } catch (e) {
      notifyError({ t, error: e as Error });
    }

    return null;
  });

  if (data == null) {
    return <Loading t={t} />;
  }

  return (
    <Layout>
      <Stack>
        <Index t={t} items={data} />
        <Link href="/{{ inputs.name | plur }}/new" passHref>
          <span className="btn btn-primary btn-block cursor-pointer">
            {t.addNew.action}
          </span>
        </Link>
      </Stack>
    </Layout>
  );
};

export default Page;
```

# `src/components/page/{{ inputs.name | plur }}/New.tsx`

```ts
import { useRouter } from "next/router";

import { toast } from "react-toastify";

import { {{ inputs.name | pascal }}Input } from "@/graphql/generated/client";

import { graphql } from "@/libs/graphql";

import { notifyError } from "@/services/client/notifier";

import { Locale } from "@/locales/Locale";

import { Layout } from "@/components/layout/Layout";

import { New } from "@/components/part/{{ inputs.name | plur }}/New";

const Page = () => {
  const router = useRouter();

  const { t } = new Locale({ locale: router.locale });

  const createHandler = async (input: {{ inputs.name | pascal }}Input) => {
    try {
      await graphql.create{{ inputs.name | pascal }}({ input });
      toast.success(t.create.succeed);
      router.push("/{{ inputs.name | plur }}");
    } catch (error) {
      notifyError({ t, error: error as Error });
    }
  };

  return (
    <Layout>
      <New t={t} createHandler={createHandler} />
    </Layout>
  );
};

export default Page;
```

# `src/components/page/{{ inputs.name | plur }}/Edit.tsx`

```ts
import { useRouter } from "next/router";

import { toast } from "react-toastify";

import { {{ inputs.name | pascal }}, {{ inputs.name | pascal }}Input } from "@/graphql/generated/client";

import { graphql } from "@/libs/graphql";

import { notifyError } from "@/services/client/notifier";

import { Locale } from "@/locales/Locale";

import { useFetch } from "@/hooks/useFetch";

import { Layout } from "@/components/layout/Layout";

import { Loading } from "@/components/ui/app/Loading";

import { Edit } from "@/components/part/{{ inputs.name | plur }}/Edit";

interface Props {
  id: string;
}

const Page = (props: Props) => {
  const { id } = props;

  const router = useRouter();

  const { t } = new Locale({ locale: router.locale });

  const updateHandler = async (input: {{ inputs.name | pascal }}Input) => {
    try {
      await graphql.update{{ inputs.name | pascal }}({ id, input });
      toast.success(t.update.succeed);
    } catch (error) {
      notifyError({ t, error: error as Error });
    }
  };

  const deleteHandler = async () => {
    try {
      await graphql.delete{{ inputs.name | pascal }}({ id });
      toast.success(t.delete.succeed);
      router.push("/{{ inputs.name | plur }}");
    } catch (error) {
      notifyError({ t, error: error as Error });
    }
  };

  const { data } = useFetch<{{ inputs.name | pascal }} | null>(async () => {
    try {
      const query = await graphql.get{{ inputs.name | pascal }}({ id });
      return query.get{{ inputs.name | pascal }};
    } catch (e) {
      notifyError({ t, error: e as Error });
    }

    return null;
  });

  if (data == null) {
    return <Loading t={t} />;
  }

  return (
    <Layout>
      <Edit
        t={t}
        item={data}
        updateHandler={updateHandler}
        deleteHandler={deleteHandler}
      />
    </Layout>
  );
};

export default Page;
```

# `src/components/part/{{ inputs.name | plur }}/Index.tsx`

```ts
import Link from "next/link";

import { {{ inputs.name | pascal }} } from "@/graphql/generated/client";

import { TextResourceProps } from "@/locales/TextResourceProps";

import { Stack } from "@/components/ui/layout/Stack";

interface Props {
  t: TextResourceProps;
  items: {{ inputs.name | pascal }}[];
}

export const Index = (props: Props) => {
  const { t, items } = props;

  if (items.length <= 0) {
    return <p>{t.list.empty}</p>;
  }

  return (
    <Stack>
      {items.map((item) => {
        const { id } = item;

        return (
          <Link key={id} href={`/{{ inputs.name | plur }}/${id}`} passHref>
            <div className="block cursor-pointer rounded border border-base-content p-2 font-mono text-base-content">
              {id}
            </div>
          </Link>
        );
      })}
    </Stack>
  );
};
```

# `src/components/part/{{ inputs.name | plur }}/New.tsx`

```ts
import { useForm, SubmitHandler } from "react-hook-form";

import { {{ inputs.name | pascal }}Input } from "@/graphql/generated/client";

import { TextResourceProps } from "@/locales/TextResourceProps";

import { Form } from "@/components/ui/form/Form";
import { FormInput } from "@/components/ui/form/FormInput";
import { Stack } from "@/components/ui/layout/Stack";

interface Props {
  t: TextResourceProps;
  createHandler: SubmitHandler<{{ inputs.name | pascal }}Input>;
}

export const New = (props: Props) => {
  const { t, createHandler } = props;

  const form = useForm<{{ inputs.name | pascal }}Input>({
    defaultValues: {
      {{ inputs.attributes | newFormDefaultValues }}
    },
  });

  return (
    <Form onSubmit={form.handleSubmit(createHandler)}>
      <Stack>
        {{ inputs.attributes | forms }}
        <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={form.formState.isSubmitting}
          >
          {t.create.action}
        </button>
      </Stack>
    </Form>
  );
};
```

# `src/components/part/{{ inputs.name | plur }}/Edit.tsx`

```ts
import { useForm, SubmitHandler } from "react-hook-form";

import { {{ inputs.name | pascal }}Input } from "@/graphql/generated/client";

import { TextResourceProps } from "@/locales/TextResourceProps";

import { Form } from "@/components/ui/form/Form";
import { FormInput } from "@/components/ui/form/FormInput";
import { Stack } from "@/components/ui/layout/Stack";

interface Props {
  t: TextResourceProps;
  item: {{ inputs.name | pascal }}Input;
  updateHandler: SubmitHandler<{{ inputs.name | pascal }}Input>;
  deleteHandler: () => void;
}

export const Edit = (props: Props) => {
  const { t, item, updateHandler, deleteHandler } = props;

  const form = useForm<{{ inputs.name | pascal }}Input>({
    defaultValues: {
      {{ inputs.attributes | editFormDefaultValues }}
    },
  });

  return (
    <Stack>
      <Form onSubmit={form.handleSubmit(updateHandler)}>
        <Stack>
          {{ inputs.attributes | forms }}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={form.formState.isSubmitting}
          >
            {t.update.action}
          </button>
        </Stack>
      </Form>
      <button
        type="submit"
        className="btn btn-secondary btn-block"
        onClick={deleteHandler}
      >
        {t.delete.action}
      </button>
    </Stack>
  );
};
```

# `src/graphql/schema.graphql`

```graphql
{{ "../src/graphql/schema.graphql" | read }}
type {{ inputs.name | pascal }} {
  id: String!
  userId: String!
  {{ inputs.attributes | graphqlSchemas }}
}

input {{ inputs.name | pascal }}Input {
  {{ inputs.attributes | graphqlSchemas }}
}

type Query {
  get{{ inputs.name | plur | pascal }}: [{{ inputs.name | pascal }}!]!
  get{{ inputs.name | pascal }}(id: String!): {{ inputs.name | pascal }}!
}

type Mutation {
  create{{ inputs.name | pascal }}(input: {{ inputs.name | pascal }}Input!): {{ inputs.name | pascal }}!
  update{{ inputs.name | pascal }}(id: String!, input: {{ inputs.name | pascal }}Input!): {{ inputs.name | pascal }}!
  delete{{ inputs.name | pascal }}(id: String!): {{ inputs.name | pascal }}!
}
```

# `src/graphql/schema/{{ inputs.name | plur }}.graphql`

```graphql
fragment {{ inputs.name | pascal }} on {{ inputs.name | pascal }} {
  id
  userId
  {{ inputs.attributes | graphqlFragmentSchemas }}
}

query get{{ inputs.name | plur | pascal }} {
  get{{ inputs.name | plur | pascal }} {
    ...{{ inputs.name | pascal }}
  }
}

query get{{ inputs.name | pascal }}($id: String!) {
  get{{ inputs.name | pascal }}(id: $id) {
    ...{{ inputs.name | pascal }}
  }
}

mutation create{{ inputs.name | pascal }}($input: {{ inputs.name | pascal }}Input!) {
  create{{ inputs.name | pascal }}(input: $input) {
    ...{{ inputs.name | pascal }}
  }
}

mutation update{{ inputs.name | pascal }}($id: String!, $input: {{ inputs.name | pascal }}Input!) {
  update{{ inputs.name | pascal }}(id: $id, input: $input) {
    ...{{ inputs.name | pascal }}
  }
}

mutation delete{{ inputs.name | pascal }}($id: String!) {
  delete{{ inputs.name | pascal }}(id: $id) {
    ...{{ inputs.name | pascal }}
  }
}
```

# `src/graphql/resolvers/{{ inputs.name | plur }}.ts`

```ts
import { NextApiRequest } from "next";

import {
  MutationCreate{{ inputs.name | pascal }}Args,
  MutationUpdate{{ inputs.name | pascal }}Args,
  MutationDelete{{ inputs.name | pascal }}Args,
  QueryGet{{ inputs.name | pascal }}Args,
  RequireFields,
} from "@/graphql/generated/resolvers";

import { db } from "@/libs/db";

import { getUser } from "@/services/server/auth";

export const get{{ inputs.name | plur | pascal }} = async (req: NextApiRequest) => {
  const user = await getUser(req);

  const data = await db.{{ inputs.name }}.findMany({ where: { userId: user.id } });

  if (data == null) {
    throw Error("Cound not select data.");
  }

  const res = data.map((findData) => {
    return {
      id: findData.id,
      userId: findData.userId,
      {{ inputs.attributes | findSchemas }}
    };
  });

  return res;
}

export const get{{ inputs.name | pascal }} = async (
  req: NextApiRequest,
  args: RequireFields<QueryGet{{ inputs.name | pascal }}Args, "id">
) => {
  const user = await getUser(req);

  const findData = await db.{{ inputs.name }}.findUnique({ where: { id: args.id } });

  if (findData?.userId != user.id) {
    throw Error("Cound not select data.");
  }

  const res = {
    id: findData.id,
    userId: findData.userId,
    {{ inputs.attributes | findSchemas }}
  };

  return res;
}

export const create{{ inputs.name | pascal }} = async (
  req: NextApiRequest,
  args: RequireFields<MutationCreate{{ inputs.name | pascal }}Args, "input">
) => {
  const user = await getUser(req);

  const findData = await db.{{ inputs.name }}.create({
    data: {
      userId: user.id,
      {{ inputs.attributes | saveSchemas }}
    },
  });

  const res = {
    id: findData.id,
    userId: findData.userId,
    {{ inputs.attributes | findSchemas }}
  };

  return res;
}

export const update{{ inputs.name | pascal }} = async (
  req: NextApiRequest,
  args: RequireFields<MutationUpdate{{ inputs.name | pascal }}Args, "id" | "input">
) => {
  const user = await getUser(req);

  const targetData = await db.{{ inputs.name }}.findUnique({ where: { id: args.id } });

  if (targetData?.userId != user.id) {
    throw Error("Cound not update data.");
  }

  const findData = await db.{{ inputs.name }}.update({
    where: { id: args.id },
    data: {
      userId: user.id,
      {{ inputs.attributes | saveSchemas }}
    },
  });

  if (findData == null) {
    throw Error("Cound not update data.");
  }

  const res = {
    id: findData.id,
    userId: findData.userId,
    {{ inputs.attributes | findSchemas }}
  };

  return res;
}

export const delete{{ inputs.name | pascal }} = async (
  req: NextApiRequest,
  args: RequireFields<MutationDelete{{ inputs.name | pascal }}Args, "id">
) => {
  const user = await getUser(req);

  const targetData = await db.{{ inputs.name }}.findUnique({ where: { id: args.id } });

  if (targetData?.userId != user.id) {
    throw Error("Cound not update data.");
  }

  const findData = await db.{{ inputs.name }}.delete({
    where: { id: args.id },
  });

  if (findData == null) {
    throw Error("Cound not update data.");
  }

  const res = {
    id: findData.id,
    userId: findData.userId,
    {{ inputs.attributes | findSchemas }}
  };

  return res;
}
```

# `src/graphql/resolvers.ts`

```ts
{{ "../src/graphql/resolvers.ts" | read }}
// eslint-disable-next-line import/order
import {
  get{{ inputs.name | plur | pascal }},
  get{{ inputs.name | pascal }},
  create{{ inputs.name | pascal }},
  update{{ inputs.name | pascal }},
  delete{{ inputs.name | pascal }},
} from "@/graphql/resolvers/{{ inputs.name | plur }}";

resolvers.Query.get{{ inputs.name | plur | pascal }} = async (_parent, args, _context) => {
  const data = await get{{ inputs.name | plur | pascal }}(_context.req);
  return data;
};

resolvers.Query.get{{ inputs.name | pascal }} = async (_parent, args, _context) => {
  const data = get{{ inputs.name | pascal }}(_context.req, args);
  return data;
};

resolvers.Mutation.create{{ inputs.name | pascal }} = async (_parent, args, _context) => {
  const data = await create{{ inputs.name | pascal }}(_context.req, args);
  return data;
};

resolvers.Mutation.update{{ inputs.name | pascal }} = async (_parent, args, _context) => {
  const data = await update{{ inputs.name | pascal }}(_context.req, args);
  return data;
};

resolvers.Mutation.delete{{ inputs.name | pascal }} = async (_parent, args, _context) => {
  const data = await delete{{ inputs.name | pascal }}(_context.req, args);
  return data;
};
```

# `prisma/schema.prisma`

```prisma
{{ "../prisma/schema.prisma" | read }}
model {{ inputs.name | pascal }} {
id String @id @default(cuid())
createdAt DateTime? @db.Timestamp(0) @default(now())
userId String
{{ inputs.attributes | prismaSchemas }}

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
