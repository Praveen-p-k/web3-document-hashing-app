// import ListConnectedAccounts from "../file-upload-or-sign/_listAccounts"

const Header = () => {
    return (
        <div className="flex justify-evenly">
            {/* <ListConnectedAccounts /> */}
            <p>Account Listing</p>
            <p className="text-center text-2xl font-bold text-primary">
                Document Signing Application
            </p>
            <div className="flex justify-between">
                <button>Contract Interactions</button>
                <button>Connect Wallet</button>
            </div>
        </div>
    )
}

export default Header;