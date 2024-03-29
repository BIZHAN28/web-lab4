package com.rasul.backend.repository;

import com.rasul.backend.dto.UserDTO;
import com.rasul.backend.model.User;
import com.rasul.backend.util.HibernateUtil;
import org.hibernate.Session;

import javax.ejb.Stateless;
import javax.ejb.TransactionManagement;

@Stateless
@TransactionManagement(javax.ejb.TransactionManagementType.BEAN)
public class UserRepository {

    public void addUser(UserDTO user) {

        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            session.beginTransaction();

            session.save(user);

            session.getTransaction().commit();
        } catch ( Exception e ) {
            if ( session.getTransaction().isActive() ) {
                session.getTransaction().rollback();
            }

        }
        finally {
            if ( session != null && session.isOpen() ) {
                session.close();
            }
        }
    }

    public User getUserByUsername(String username) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        UserDTO result;
        try {
            result = (UserDTO) session.createQuery("from UserDTO where username = :username")
                    .setParameter("username", username)
                    .getSingleResult();
        } catch (Exception ex) {
            if ( session.getTransaction().isActive() ) {
                session.getTransaction().rollback();
            }
            System.out.println(ex.getMessage());
            result = null;
        } finally {
            if (session != null && session.isOpen())
                session.close();
        }
        return result == null ? null : new User(result.getUsername(), result.getPassword());
    }

    public UserDTO getUserDTOByUsername(String username) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        UserDTO result;
        try {
            result = (UserDTO) session.createQuery("from UserDTO where username = :username")
                    .setParameter("username", username)
                    .getSingleResult();
        } catch (Exception ex) {
            if ( session.getTransaction().isActive() ) {
                session.getTransaction().rollback();
            }
            System.out.println(ex.getMessage());
            result = null;
        } finally {
            if (session != null && session.isOpen())
                session.close();
        }
        return result;
    }
}
