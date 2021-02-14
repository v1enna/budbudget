import React from 'react'
import { Button } from 'antd'
import { useLoginContext } from '../contexts/LoginContext'

export default function LogoutButton() {
	const contextType = useLoginContext();

	function tryLogout() {
		if(contextType.isLoggedIn && contextType.setIsLoggedIn)
			contextType.setIsLoggedIn(false);
	}

	return (
		<Button type="primary" danger onClick={tryLogout}>
			Esci
		</Button>
	)
}
