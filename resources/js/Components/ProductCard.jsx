import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    IconButton
} from '@material-tailwind/react'
import { FaStar } from 'react-icons/fa'

export function ProductCard () {
    return (
        <Card className='w-full md:w-96 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto my-6 shadow-lg'>
            <CardHeader
                floated={false}
                color='blue-gray'
                className='relative h-64 sm:h-72 md:h-80'
            >
                <img
                    src='https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
                    alt='ui/ux review check'
                    className='h-full w-full md:h-80 object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/60' />
                <IconButton
                    size='sm'
                    color='red'
                    variant='text'
                    className='!absolute top-4 right-4 rounded-full'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='h-6 w-6'
                    ></svg>
                </IconButton>
            </CardHeader>
            <CardBody>
                <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                    <Typography
                        variant='h5'
                        color='blue-gray'
                        className='font-medium'
                    >
                        Wooden House, Florida
                    </Typography>
                    <Typography
                        color='blue-gray'
                        className='flex items-center gap-1.5 font-normal'
                    >
                        <FaStar className='text-orange-400' />
                        5.0
                    </Typography>
                </div>
                <Typography color='gray' className='text-sm md:text-base'>
                    Enter a freshly updated and thoughtfully furnished peaceful
                    home surrounded by ancient trees, stone walls, and open
                    meadows.
                </Typography>
            </CardBody>
            <CardFooter className='pt-4'>
                <Button fullWidth color='blue'>
                    Book Now
                </Button>
            </CardFooter>
        </Card>
    )
}
