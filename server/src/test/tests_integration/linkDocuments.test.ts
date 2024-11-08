import { describe, beforeEach, beforeAll, afterAll, test, expect } from "@jest/globals";
import request from 'supertest';


import { LinksDAO } from "../../rcd/daos/LinksDAO";
import { LinkController } from "../../rcd/controllers/LinkController";
import { DocumentLink, LinkType } from "../../models/document";

import { app, server } from '../../../index';
import dbpg from '../../db/temp_db';

import { dbEmpty } from '../../db/db_common_operations';
import { populate } from '../populate_for_some_tests';
import db from '../../db/db';

describe('get links integretion', () => {
    let linksDAO: LinksDAO;
  let linkController: LinkController;

  beforeAll(async () => {
    // Initialize test structures
    linksDAO = new LinksDAO();
    linkController = new LinkController();
  });

  /*beforeEach(async () => {
    
  })

  afterAll(async () => {
    await dbEmpty();

    await dbpg.disconnect();
    server.close();
  });*/

  afterAll(async () => {
    await dbEmpty();

    await dbpg.disconnect();
    server.close();
    await db.destroy();
  });



  describe('linkDAO test', () => {
    test('createLink OK', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        await dbEmpty();
        await populate();
        const response = await linksDAO.createLink(15,18,LinkType.projection);
        expect(response).toBe(1);
        
    })
    test('createLink link already exists', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linksDAO.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        await expect(linksDAO.createLink(15, 18, LinkType.direct)).rejects.toThrow("link already exists");
    })
    test('createLink two links with different types ', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linksDAO.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        const response2 = await linksDAO.createLink(15,18,LinkType.update);
        expect(response2).toBe(1);
    })
    test('createLink link already exists but documents are inverted ', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linksDAO.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        await expect(linksDAO.createLink(18, 15, LinkType.direct)).rejects.toThrow("link already exists");
    })
    // TODO???: the behaviour is not wrong, so should not reject, fix maybe
    // test('createLink link but the document does not exist ', async () => {
    //     await dbpg.client.query('DELETE FROM document_links');
    //     await expect(linksDAO.createLink(180, 15, LinkType.direct)).rejects.toThrow();
    // })
    test('get ticket ok', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linksDAO.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        const res = await linksDAO.getLinks(15);
        expect(res[0].docId1).toBe(15);
        expect(res[0].docId2).toBe(18);
        expect(res[0].linkType).toBe("direct");
    })
    test('get ticket ok with multiple links', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linksDAO.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        const response2 = await linksDAO.createLink(15,41,LinkType.direct);
        expect(response2).toBe(1);
        const res = await linksDAO.getLinks(15);
        expect(res[0].docId1).toBe(15);
        expect(res[0].docId2).toBe(18);
        expect(res[0].linkType).toBe("direct");
        expect(res[1].docId1).toBe(15);
        expect(res[1].docId2).toBe(41);
        expect(res[1].linkType).toBe("direct");
    })
    test('get ticket bidirectional', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linksDAO.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        const response2 = await linksDAO.createLink(15,41,LinkType.direct);
        expect(response2).toBe(1);
        const res = await linksDAO.getLinks(18);
        expect(res[0].docId1).toBe(15);
        expect(res[0].docId2).toBe(18);
        expect(res[0].linkType).toBe("direct");
    })
    test('get ticket different types', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linksDAO.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        const response2 = await linksDAO.createLink(15,18,LinkType.collateral);
        expect(response2).toBe(1);
        const res = await linksDAO.getLinks(18);
        expect(res[0].docId1).toBe(15);
        expect(res[0].docId2).toBe(18);
        expect(res[0].linkType).toBe("direct");
        expect(res[1].docId1).toBe(15);
        expect(res[1].docId2).toBe(18);
        expect(res[1].linkType).toBe("collateral");
    })
    test('get ticket empty links', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const res = await linksDAO.getLinks(15);
        expect(res).toHaveLength(0);
    })
  })
  describe('link Controller test ', () => {
    test('createLink link ok ', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await  linkController.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
    })
    test('documents does not exist', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        await expect(linkController.createLink(180, 15, LinkType.direct)).rejects.toThrow();
    })
    test('errors are reported', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await linkController.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        await expect(linkController.createLink(18, 15, LinkType.direct)).rejects.toThrow("link already exists");
    })
    test('getLinks ok ', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        const response = await  linkController.createLink(15,18,LinkType.direct);
        expect(response).toBe(1);
        const res = await linkController.getLinks(18);
        expect(res[0].docId1).toBe(15);
        expect(res[0].docId2).toBe(18);
        expect(res[0].linkType).toBe("direct");
    })
    test('getLinks documents does not exist', async () => {
        await dbpg.client.query('DELETE FROM document_links');
        await expect(linkController.getLinks(180)).rejects.toThrow("one of the documents does not exist");
    })
  })
  describe('link routes test ', () => {
    test('create link ok', async() => {
        await dbpg.client.query('DELETE FROM document_links');
        const res = await request(app).post(`/kiruna_explorer/linkDocuments/create`)
        .send( {doc_id1: 15,
            doc_id2: 18,
            link_type: "update"});
        expect(res.status).toBe(201);
    })
    test('validation of document id', async() => {
        await dbpg.client.query('DELETE FROM document_links');
        const res = await request(app).post(`/kiruna_explorer/linkDocuments/create`)
        .send( {doc_id1: 15,
            doc_id2: 18,
            link_type: "ooo"});
        expect(res.status).toBe(422);
    })
    test('error propagation', async() => {
        await dbpg.client.query('DELETE FROM document_links');
        const res = await request(app).post(`/kiruna_explorer/linkDocuments/create`)
        .send( {doc_id1: 150,
            doc_id2: 18,
            link_type: "update"});
        expect(res.status).toBe(400);
    })
    test('get links ok', async() => {
        await dbpg.client.query('DELETE FROM document_links');
        const res = await request(app).post(`/kiruna_explorer/linkDocuments/create`)
        .send( {doc_id1: 15,
            doc_id2: 18,
            link_type: "update"});
        expect(res.status).toBe(201);
        let res2 = await request(app).get(`/kiruna_explorer/linkDocuments/15`)
        expect(res2.status).toBe(200);
        const t = res2.body[0] as DocumentLink;
        expect(t.docId1).toBe(15);
        expect(t.docId2).toBe(18);
        expect(t.linkType).toBe("update");
    })
    test('error propagation', async() => {
        await dbpg.client.query('DELETE FROM document_links');
        const res = await request(app).get(`/kiruna_explorer/linkDocuments/150`)
        expect(res.status).toBe(400);
    })
  })
})



