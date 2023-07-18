"use client"

import { useEffect, useState } from "react"
import { createStyles, Header, Container, Group, Burger, Paper, Transition, rem, Button } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Link from "next/link"
import LogoutButton from "../../LogoutButton"
import { getUser, signOut } from "../../../supabase_request"
import { Session } from "@supabase/supabase-js"
const HEADER_HEIGHT = rem(60)

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none"
    }
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%"
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none"
    }
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none"
    }
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md
    }
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color
    }
  }
}))

interface HeaderResponsiveProps {
  links: { link: string; label: string }[]
}

function HeaderResponsive({ links }: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false)
  const [session, setSession] = useState<Session | null>()
  const [active, setActive] = useState(links[0].link)
  const { classes, cx } = useStyles()

  useEffect(() => {
    getUser().then((session) => {
      setSession(session.session)
    })
  }, [])

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={(event) => {
        setActive(link.link)
        close()
      }}
    >
      {link.label}
    </Link>
  ))

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        {session ? (
          <>
            <h1>{session.user.email}</h1>
            <Button
              variant='light'
              onClick={() => {
                signOut().then((success) => {
                  if (success) {
                    setSession(null)
                  }
                })
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Link href='/login'>
            <Button variant='light'>Login</Button>
          </Link>
        )}
      </Container>
    </Header>
  )
}

export default HeaderResponsive
