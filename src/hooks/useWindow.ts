import { useEffect, useState } from 'react';

const useWindowSize = () => {
    const [size, setSize] = useState<{ width: number, height: number }>({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        function resize() {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        }

        window.addEventListener('resize', resize);
        
        return () => window.removeEventListener('resize', resize);
    }, []);

    return size;
}

export default useWindowSize;