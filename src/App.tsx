import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes'
import { Toaster } from "sonner"


function App() {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-center"
            />
        </>
    )

}

export default App
