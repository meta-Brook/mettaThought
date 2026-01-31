'use client'

import {useEffect,useState} from 'react';
import { EdgeResult } from '@/lib/neo4j/types'

type Props = {
    relationship: string;
    cypher: EdgeResult;
}

export default function relView({relationship, cypher}: Props){

}